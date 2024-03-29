const Collection = require("../models/Collection.model");
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/route.guard.middleware');
const Vinyl = require("../models/Vinyl.model");


router.get('/collections', isAuthenticated, async (req, res) => {
    try {
        console.log(req.tokenPayload)
      const collections = await Collection.find({ user: req.tokenPayload.userId }).populate("vinyl user");
      res.json(collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({ error: 'Internal server error' });
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
        let collection = await Collection.findOne({ user: userId });
        if (!collection) {
            collection = await Collection.create({ user: userId });
        }
        if (!vinylExists) {
            console.log('Vinyl not found'); 
            return res.status(404).json({ message: "Vinyl not found" });
        }
        const updateCollection = await Collection.findOneAndUpdate(
            { user: userId },
            { $addToSet: { vinyl: vinylId } }, 
            { new: true } 
        );
        console.log('Updated collection:', updateCollection); 
        res.status(201).json(updateCollection);
    } catch (error) {
        next(error);
        console.error("Error while adding vinyl to collection:", error);
    }
});



module.exports = router;
