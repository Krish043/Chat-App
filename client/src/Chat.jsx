import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom"
const chats = ({ socket, username, room }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setmessageList] = useState([])
  const sendMessage = async()=>{
    if(currentMessage!== ""){
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      };

      await socket.emit("send_message", messageData);
      setmessageList((list)=>[...list,messageData]);
      setcurrentMessage("");
    }
  };

  useEffect(()=>{
    socket.on("recieve_message", (data)=>{
      setmessageList((list)=>[...list,data]);
    })
  }, [socket]);


  return (
    <div>
      <div className="chat-window">

      <div className="chat-header">
        <p>Live Chat</p>  
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        {messageList.map((messageContent)=>{
          // return <h1>{messageContent.message}</h1>
          return (
          <div className="message" id={username === messageContent.author ? "other": "you"}>
            <div>
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
                <p id="author">{messageContent.author}</p>
              </div>
            </div>
          </div>
          )
        })}
        </ScrollToBottom>
        
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Enter your message here..."
          value={currentMessage}
          onChange={(event) => {
            setcurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {event.key =="Enter" && sendMessage()}}
          />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
          </div>
  );
};

export default chats;
