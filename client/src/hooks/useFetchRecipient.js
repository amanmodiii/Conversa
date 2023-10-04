import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (user, chat)=>{
    const [recipient, setRecipient] = useState(null);
    const [err, setErr] = useState(null);

    const recipientId = chat?.members?.find((id)=> id !==user?._id)

    useEffect(()=>{
        const getUser = async()=>{
            if(!recipientId)
                return null;
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`)

            if(response.error)
                return setErr(response.error);

            setRecipient(response);
        }

        getUser();
    }, [recipientId]);

    return { recipient };
}