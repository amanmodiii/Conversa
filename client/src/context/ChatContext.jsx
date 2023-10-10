import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsloading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendMessageError, setSendMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io("https://conversa-socket.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send messsage
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [currentChat, newMessage]);

  //recieve message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.sid);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error)
        return console.log("Error fetching user : ", response.error);
      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats, user]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChats(null);
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) return setUserChatsError(response);

        setUserChats(response);
      }
    };

    getUserChats();
  }, [user,notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setMessagesLoading(true);
      setMessageError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setMessagesLoading(false);

      if (response.error) return setMessageError(response);

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (msg, sender, chatid, setTextMessage) => {
      if (!msg) return console.log("Empty Message");
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: chatid,
          sid: sender._id,
          text: msg,
        })
      );
      if (response.error) return setSendMessageError(response);
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (fid, sid) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        fid,
        sid,
      })
    );
    if (response.error)
      return console.log("Error creating chat: ", response.error);

    setUserChats((prev) => [...prev, response]);
  }, []);

  const markAllNotificationsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback((n, userChats, user, notifications)=>{
    //find chat to open
    const desiredChat = userChats?.find(chat=>{
      const chatMembers = [user._id, n.sid]
      const isDesiredChat = chat?.members.every(member => {
        return chatMembers.includes(member);
      });
      return isDesiredChat;
    });
    //update the notification as read
    const mNotifications = notifications.map(el=>{
      if(n.sid === el.sid){
        return {...n, isRead:true}
      } else {
        return el;
      }
    });
    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
  },[updateCurrentChat]);

  const markThisAsRead = useCallback((thisUserNotifications, notifications)=>{
    const mNotifications = notifications.map(el=>{
      let notification;
      thisUserNotifications.forEach(n=>{
        if(n.sid=== el.sid){
          notification = {...n, isRead:true};
        } else {
          notification = el;
        }
      })
      return notification;
    })
    setNotifications(mNotifications);
  },[]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsloading,
        userChatsError,
        potentialChats,
        allUsers,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messageError,
        sendTextMessage,
        onlineUsers,
        notifications,
        markAllNotificationsRead,
        markNotificationAsRead,
        markThisAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
