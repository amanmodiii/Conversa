import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat)=>{
    const {newMessage, notifications } = useContext(ChatContext);
    const [lmsg, setLmsg] = useState(null);

    useEffect(()=>{
        const getMessages = async ()=>{
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if(response.error)
                return console.log("Error getting latest message : ", response.error);

            const lastMessage = response[response?.length - 1];

            setLmsg(lastMessage);
        };
        getMessages();
    },[newMessage, notifications]);
    return {lmsg};
}