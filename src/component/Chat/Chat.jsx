import React, { useEffect, useState } from 'react'
import {user} from "../Join/Join"
import socketIo from "socket.io-client";
import "./Chat.css"
import sendLogo from "../../images/send.png"
import closeIcon from "../../images/closeIcon.png"
import Message from "../Message/Message"
import ReactScrollTOBottom from "react-scroll-to-bottom"

const ENDPOINT="http://localhost:5500/";

let socket;

const Chat = ()=>{

  const [id, setid] = useState(" ");
  const [messages, setMessages] = useState([])

  const send=()=>{
       const message=document.getElementById('chatInput').value;
       socket.emit('message',{message,id});
       document.getElementById('chatInput').value=" ";
      
  }


  useEffect(()=>{

   socket=socketIo(ENDPOINT,{transports:['websocket']});

   socket.on('connect',()=>{
    alert("connected");
    setid(socket.id);

   })
   console.log(socket);
   socket.emit('joined',{user})

   socket.on('welcome',(data)=>{
   setMessages([...messages,data])
   console.log(data.user,data.message);
   })

   socket.on('userJoined',(data)=>{
    setMessages([...messages,data])
    console.log(data.user,data.message)
   })

   socket.on('leave',(data)=>{
    setMessages([...messages,data])
      console.log(data.user,data.message);
   })

   return ()=>{
    socket.disconnect();
    socket.off();

   }
 } ,[])


 useEffect(() => {
   socket.on('sendMessage',(data)=>{
    setMessages([...messages,data])
    console.log(data.user,data.message,data.id);
   })
 
   return () => {
      socket.off();
   }
 }, [messages])
 
  
  return (
    <div className='chatPage'>
      <div className="chatContainer">
        <div className="header">
          <h2>R CHAT</h2>
           <a href="/"><img src={closeIcon} alt="close"/></a>
        </div>
        <ReactScrollTOBottom className="chatBox">
          {messages.map((item,i) => <Message  user={item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'}/>)}
        </ReactScrollTOBottom>
        <div className="inputBox ">
          <input type="text" id="chatInput"/>
          <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send"/></button>
        </div>
      </div>
    </div>
  )
}

export default Chat




