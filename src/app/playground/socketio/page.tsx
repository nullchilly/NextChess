"use client"
import React from "react"
import { io } from "socket.io-client";

export default function PlaygroundSocket() {
  const [websckt, setWebsckt] = React.useState<WebSocket>();
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {

    const socket = io("http://localhost:8000");
    // const socket = io("ws://localhost:8000", {{ path: "/ws/socket.io/", transports: ['websocket', 'polling'] }});
    socket.on("connect", () => { console.log("Connected", socket.id) }); 
    socket.emit('direct', 'Hello how are you???');
    // socket.on("response", () => { console.log("Response", socket.id) });  
    // socket.on("message", data => { console.log(data) });

    const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}` + '/ws';
    const ws = new WebSocket(url);
    ws.onopen = event => {
      ws.send("Connect");
    };

    // recieve message every start page
    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      console.log("mess: ", message);
      setMessages((prev) => [...prev, message.message ?? "EMPTY"]);
    };
    setWebsckt(ws);
    //clean up function when we close page
    // return () => ws.close();
  }, [])

  const handleOnClick = () => {
    websckt?.send("Hello how are you???");
  }

  return (
    <div>
      <p>Hello Socket!</p>
      <button onClick={handleOnClick}>
        Send
      </button>
      {messages.map((m, index) => {
        return (
            <div key={index}>
              {m}
            </div>
        )
      })}
    </div>
  )
}
