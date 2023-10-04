const mong = require("mongoose");

const messageSchema = new mong.Schema({
    chatId: String,
    sid: String,
    text: String,
},{
    timestamps: true,
});

const messageModel = mong.model("Message", messageSchema);

module.exports = messageModel;