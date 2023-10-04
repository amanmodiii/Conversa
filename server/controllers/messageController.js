const messageModel = require("../models/messageModel");

//api endpoints for creating and getting messages

const createMessage = async(req, res )=>{
    const { chatId, sid, text} = req.body;

    const message = new messageModel({
        chatId, sid, text
    })

    try{
        const response = await message.save();
        res.status(200).json(response);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

const getMessages = async( req, res)=>{
     const { chatId } = req.params;

     try{
        const messages = await messageModel.find({ chatId})
        res.status(200).json(messages);
     } catch(err){
        console.log(err);
        res.status(500).json(err);
     }
}

module.exports = { createMessage, getMessages };