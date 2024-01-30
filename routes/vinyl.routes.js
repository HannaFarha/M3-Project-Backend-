const Vinyl = require("../models/Vinyl.model");
const Collection = require("../models/Collection.model");
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/route.guard.middleware')

router.get("/vinyls", async (req, res, next) => {
  try {
    const vinyls = await Vinyl.find().populate("createdBy");
    console.log("Retrieved vinyl ->", vinyls);
    res.json(vinyls);
  } catch (error) {
    next(error);
    console.error("Error while retrieving vinyls ->", error);
  }
});

router.get("/vinyls/:vinylId", async (req, res) => {
  const { vinylId } = req.params;
  try {
    const vinyls = await Vinyl.findById(vinylId);
    res.status(200).json(vinyls)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'error while getting the Vinyl' })
  }
 
});


router.put("/vinyl/:vinylId", isAuthenticated, async(req, res, next) => {
    const { userId } = req.tokenPayload
  const vinylId = req.params.vinylId;

  const payload = req.body
 
  try {
    const vinylToUpdate = await Vinyl.findById(vinylId)
    if (vinylToUpdate.createdBy == userId) {
      const updatedVinyl = await Vinyl.findByIdAndUpdate(vinylId, payload, { new: true })
      res.status(200).json(updatedVinyl)
    } else {
      res.status(403).json({ message: 'you are not the right user' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'error while updating the Vinyl' })
  }
 });

router.delete("/vinyl/:vinylId",isAuthenticated, async(req, res, next) => {
  const vinylId = req.params.vinylId;
  const { userId } = req.tokenPayload
  try {
    const vinylToDelete = await Vinyl.findById(vinylId)
    console.log(vinylToDelete, userId)
    if (vinylToDelete.createdBy == userId) {
      console.log('Deleting')
      await Vinyl.findByIdAndDelete(vinylId)
      res.status(204).json()
    } else {
      res.status(403).json({ message: 'you are not the right user' })
    }
  } catch (error) {
    res.status(500).json({ message: 'error while deleting the Vinyl' })
  }

});

router.post("/vinyls",isAuthenticated, async (req, res, next) => {
    const payload = req.body
    const { userId } = req.tokenPayload
  payload.createdBy = userId
  try {
    const newVinyl = await Vinyl.create(payload);
    res.status(201).json(newVinyl);
  } catch (error) {
    next(error);
    console.log(error);
  }
});



router.get("/collection",isAuthenticated , async (req, res, next) => {
    try {
      const Collections = await Collection.find().populate("vinyl");
      console.log("Retrieved vinyl ->", Collections);
      res.json(Collections);
    } catch (error) {
      next(error);
      console.error("Error while retrieving Collection ->", error);
    }

  });

  router.post("/collection/:vinylId",isAuthenticated, async (req, res, next) => {
    const payload = req.body
    const { userId } = req.tokenPayload
  payload.createdBy = userId
  try {
    const newVinyl = await Vinyl.create(payload);
    res.status(201).json(newVinyl);
  } catch (error) {
    next(error);
    console.log(error);
  }
});


module.exports = router;