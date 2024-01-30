const Collection = require("../models/Collection.model");
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/route.guard.middleware')
router.get("/collection", async (req, res, next) => {
    try {
      const Collections = await Collection.find().populate("user");
      console.log("Retrieved vinyl ->", Collections);
      res.json(Collections);
    } catch (error) {
      next(error);
      console.error("Error while retrieving Collection ->", error);
    }
  });
  module.exports = router;