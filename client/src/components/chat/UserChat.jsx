import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar1 from "../../assets/avatar1.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

function UserChat({ chat, user }) {
  const { recipient } = useFetchRecipientUser(user, chat);
  const { onlineUsers, notifications, markThisAsRead } =
    useContext(ChatContext);
  const { lmsg } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.sid === recipient?._id
  );
  const isOnline = onlineUsers?.some((user) => user?.userId === recipient?._id);
  const textmsg = (text) => {
    let stxt = text.substring(0, 20);
    if (text.length > 20) {
      stxt = stxt + "...";
    }
    return stxt;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card p-2 align-items-center justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar1} height="35px" className="avatar" />
        </div>
        <div className="text-content">
          <div className="name">{recipient?.name}</div>
          <div className="text">
            {lmsg?.text && <span>{textmsg(lmsg?.text)}</span>}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">{moment(lmsg?.createdAt).calendar()}</div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
}

export default UserChat;
