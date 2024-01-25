const Vinyl = require("../models/Vinyl.model");
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

//  GET /api/students/:studentId - Retrieves a specific student by id
router.get("/vinyls/:vinylId", async (req, res) => {
  const { vinylId } = req.params;
  try {
    const vinyl = await Vinyl.findById(vinylId);
    res.status(200).json(vinyl)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'error while getting the Vinyl' })
  }
 
});

//  PUT /api/students/:studentId - Updates a specific student by id
router.put("/vinyl/:vinylId", isAuthenticated, async(req, res, next) => {
    const { userId } = req.tokenPayload
  const vinylId = req.params.vinylId;
//   const updatedVinylData = req.body;
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



//   Vinyl.findByIdAndDelete(vinylId)
//     .then((deleteVinyl) => {
//       if (!deleteVinyl) {
//         return res.status(404).json({ error: "vinyl not found" });
//       }
//       console.log("delete vinyl by ID", deleteVinyl);
//       res.json({ message: "vinyl deleted successfully" });
//     })
//     .catch((error) => {
//       next(error);
//       console.error("Error while deleting vinyl by ID", error);
//     });
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


module.exports = router;
