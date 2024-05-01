const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.post("/battleship/updatescore", controller.updatescore_battleship);
router.post("/whackaplane/gethighscore", controller.getscore_whackaplane);
router.post("/whackaplane/updatehighscore", controller.updatescore_whackaplane);
router.post("/whackaplane/getLeaderBoard", controller.getLeaderBoard);

module.exports = router;
