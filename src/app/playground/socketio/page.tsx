"use client";
import React from "react";
import { io, Socket } from "socket.io-client";

export default function PlaygroundSocket() {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Connected", socket.id);
      });
      // socket.emit('direct', 'Hello how are you???');
      socket.on("response", (msg) => {
        console.log("Response", msg);
        // setMessages((prev) => [...prev, msg ?? "EMPTY"]);
      });
    }
  }, [socket]);

  const handleOnClick = () => {
    console.log("Send", "Hello how are you???");
    socket?.emit("direct", "Hello how are you???");
  };

  const handleConnect = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      autoConnect: false,
      reconnection: false,
    });
    setSocket(socket);
  }

  const handleDisconnect = () => {
    socket?.close();
    setSocket(null);
  }

  return (
    <div>
      <p>Hello Socket!</p>
      <button onClick={handleOnClick}>Send</button>
      <br/>
      <button onClick={handleConnect}>Connect</button>
      <br/>
      <button onClick={handleDisconnect}>Disconnect</button>
      {messages.map((m, index) => {
        return <div key={index}>{m}</div>;
      })}
    </div>
  );
}
