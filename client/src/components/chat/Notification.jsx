import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.sid);
    return { ...n, sName: sender?.name };
  });

  return (
    <div className="notifications">
      <div
        className="notifications-icon"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-chat-left"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen && (
        <div
          className="notifications-box"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          {modNotifications?.length === 0 ? (
            <span className="notification">No notifications yet...</span>
          ) : null}
          {modNotifications &&
            modNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    setIsOpen(false);
                  }}
                >
                  <span>{`${n.sName} sent you a new message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Notification;
