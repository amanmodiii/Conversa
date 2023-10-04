const exp = require("express");
const { createChat, findUserChats, findChat } = require("../controllers/chatController");

const router = exp.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:fid/:sid", findChat);

module.exports = router;