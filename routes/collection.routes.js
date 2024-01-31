const Collection = require("../models/Collection.model");
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/route.guard.middleware');
const Vinyl = require("../models/Vinyl.model");


router.use("/collection", isAuthenticated);

router.get("/collection", async (req, res, next) => {
    try {
        const userId = req.tokenPayload.userId;
        const collections = await Collection.find({ user: userId }).populate("user vinyl")
        
        console.log("Retrieved collections ->", collections);
        res.json(collections);
    } catch (error) {
        next(error);
        console.error("Error while retrieving Collection ->", error);
    }
});

router.post("/collection/:vinylId", async (req, res, next) => {
    try {
        console.log('Incoming request:', req.params); 
        const { userId } = req.body;
        const { vinylId } = req.params;
        console.log('User ID:', userId);
        console.log('Vinyl ID:', vinylId);

        const vinylExists = await Vinyl.findById(vinylId);
        console.log('Vinyl exists:', vinylExists); 

        if (!vinylExists) {
            console.log('Vinyl not found'); 
            return res.status(404).json({ message: "Vinyl not found" });
        }
        const newCollection = await Collection.create({ user: userId });
        const updateCollection = await Collection.findOneAndUpdate({user: userId},{$push:{vinyl: vinylId }})
        console.log('New collection:', updateCollection); 
        res.status(201).json(updateCollection);
    } catch (error) {
        next(error);
        console.error("Error while adding vinyl to collection:", error);
    }
});


module.exports = router;
