"use client"
import React from "react"
import { io } from "socket.io-client";

export default function PlaygroundSocket() {
  const [websckt, setWebsckt] = React.useState<WebSocket>();
  const [messages, setMessages] = React.useState<string[]>([]);

  // const socket = io("http://localhost:3000", { autoConnect: false, transports: ["websocket"] });
  const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, { autoConnect: false, reconnection: false });

  React.useEffect(() => {

    socket.connect()
    socket.on("connect", () => { console.log("Connected", socket.id) }); 
    // socket.emit('direct', 'Hello how are you???');
    // socket.on("response", () => { console.log("Response", socket.id) });  
    // socket.on("message", data => { console.log(data) });

  }, [])

  const handleOnClick = () => {
    socket.emit('direct', 'Hello how are you???');
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
