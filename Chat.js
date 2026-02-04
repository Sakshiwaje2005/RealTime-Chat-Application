import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("messageHistory", (history) => {
      setChat(history);
    });

    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = {
        user: username,
        text: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("sendMessage", msgData);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {!joined ? (
        <div className="join-box">
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter username..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setJoined(true)}>Join</button>
        </div>
      ) : (
        <div className="chat-box">
          <h2>Real-Time Chat App</h2>

          <div className="messages">
            {chat.map((msg, index) => (
              <div key={index} className="msg">
                <strong>{msg.user}</strong>: {msg.text}
                <span>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={message}
              placeholder="Type message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;