const mong = require("mongoose");

const chatSchema = new mong.Schema(
    {
        members: Array,
    },{
        timestamps: true,
    }
);

const chatModel = mong.model("Chat", chatSchema);

module.exports = chatModel;