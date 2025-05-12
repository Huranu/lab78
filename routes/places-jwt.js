const express = require("express");

const {
  getPlaceDetail,
  getUserPlaces,
  createPlace,
  deletePlace,
  updatePlace,
} = require("../controller/places-jwt");
const { jwtRestrictAuthenticated } = require("../middleware/protect");

const router = express.Router();

router.route("/user/:uid").get(getUserPlaces);

router.route("/").post(jwtRestrictAuthenticated,createPlace);

router.route("/:placeId").get(getPlaceDetail).delete(jwtRestrictAuthenticated,deletePlace).put(jwtRestrictAuthenticated,updatePlace);

module.exports = router;
