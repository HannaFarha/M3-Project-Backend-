const Vinyl = require("../models/Vinyl.model");
const router = require("express").Router();

router.get("/vinyls", async (req, res, next) => {
  try {
    const Vinyl = await Vinyl.find().populate("user");
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
  const vinyl = await Vinyl.findById(vinylId).populate("User");
  res.json(vinyl);
});

//  PUT /api/students/:studentId - Updates a specific student by id
router.put("/vinyl/:vinylId", (req, res, next) => {
  const vinylId = req.params.vinylId;
  const updatedVinylData = req.body;
  Vinyl.findByIdAndUpdate(vinylId, updatedVinylData, { new: true })
    .then((updatedVinyl) => {
      if (!updatedVinyl) {
        return res.status(404).json({ error: "vinyl not found" });
      }
      console.log("updated vinyl by ID", updatedVinyl);
      res.json(updatedVinyl);
    })
    .catch((error) => {
      next(error);
      console.log("Error while updating vinyl data".error);
    });
});

//  DELETE /api/students/:studentId - Deletes a specific student by id
router.delete("/vinyl/:vinylId", (req, res, next) => {
  const vinylId = req.params.vinylId;

  Vinyl.findByIdAndDelete(vinylId)
    .then((deleteVinyl) => {
      if (!deleteVinyl) {
        return res.status(404).json({ error: "student not found" });
      }
      console.log("delete vinyl by ID", deleteVinyl);
      res.json({ message: "vinyl deleted successfully" });
    })
    .catch((error) => {
      next(error);
      console.error("Error while deleting vinyl by ID", error);
    });
});

router.post("/vinyls", async (req, res, next) => {
  const payload = req.body;
  try {
    const newVinyl = await Vinyl.create(payload);
    res.status(201).json(newVinyl);
  } catch (error) {
    next(error);
    console.log(error);
  }
});
// router.get("/vinyl/cohort/:cohortId", (req, res, next) => {
//   const { cohortId } = req.params;
//   Vinyl.find({ cohort: cohortId })
//     .populate("cohort")
//     .then((students) => {
//       res.json(students);
//     })
//     .catch((error) => {
//       next(error);
//       console.error("Error while retrieving students ->", error);
//     });
// });
module.exports = router;
