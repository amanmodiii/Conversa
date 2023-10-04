const exp = require("express");
const {
  createMessage, getMessages
} = require("../controllers/messageController");

const router = exp.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);

module.exports = router;
