const chatModel = require("../models/chatModel");
//to create chats
//to get all chats for a user
//find a chat

const createChat = async(req, res)=>{
    const { fid, sid } = req.body;

    try{
        const chat = await chatModel.findOne({
            members: { $all: [fid, sid ] },
        });
        if(chat) return res.status(200).send(chat);
        const newChat = new chatModel({
            members: [fid, sid],
        });
        const response = await newChat.save();

        res.status(200).send(response);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const findUserChats = async(req, res)=>{
    const userId = req.params.userId;
    try{
        const chats = await chatModel.find({
            members: {$in: [userId]}
        })
        res.status(200).json(chats);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const findChat = async(req, res)=>{
    const fid = req.params.fid;
    const sid = req.params.sid;
    try {
      const chat = await chatModel.findOne({
        members: { $all: [fid, sid] },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
}

module.exports = { createChat, findUserChats, findChat };