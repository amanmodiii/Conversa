import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import "boxicons";

function ChatBox() {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipient } = useFetchRecipientUser(user, currentChat);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipient)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet...
      </p>
    );
  if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );
  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipient?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((msg, index) => (
            <Stack
              key={index}
              className={`${
                msg?.sid === user?._id
                  ? "message self align-self-end flex-grow-0 bg-warning"
                  : "message align-self-start flex-grow-0"
              }`}
              ref={scroll}
            >
              <span>{msg.text}</span>
              <span className="message-footer">
                {moment(msg.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          placeholder="Enter a message"
          onChange={setTextMessage}
          fontFamily="inter"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn bg-warning"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <box-icon type="solid" color="white" name="send"></box-icon>
        </button>
      </Stack>
    </Stack>
  );
}

export default ChatBox;
