const express = require("express");

const {
  getPlaceDetail,
  getUserPlaces,
  createPlace,
  deletePlace,
  updatePlace,
} = require("../controller/places");
const { sessionRestrictAuthenticated } = require("../middleware/protect");

const router = express.Router();

router.route("/user/:uid").get(getUserPlaces);

router.route("/").post(sessionRestrictAuthenticated,createPlace);

router.route("/:placeId").get(getPlaceDetail).delete(sessionRestrictAuthenticated,deletePlace).put(sessionRestrictAuthenticated,updatePlace);

module.exports = router;
