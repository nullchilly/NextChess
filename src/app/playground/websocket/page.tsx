"use client";
import React from "react";

enum ConnectionStatus {
  Open = "open",
  Connecting = "connecting",
  Disconnected = "disconnected",
}

export default function PlaygroundSocket() {
  // const [socket] = React.useState(io(${process.env.NEXT_PUBLIC_SOCKET_URL}));
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>(ConnectionStatus.Disconnected);

  const disconnectSocket = React.useCallback(() => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  }, [socket, setConnectionStatus]);

  React.useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        setConnectionStatus(ConnectionStatus.Open);
      };

      socket.onmessage = (msg) => {
        const message = JSON.parse(msg.data);
        console.log("Message from BE: ", message);
        setMessages((prev) => [...prev, message.message ?? "EMPTY"]);
      };

      socket.onerror = () => {
        disconnectSocket();
        console.error("Websocket connection error");
      };

      socket.onclose = () => {
        disconnectSocket();
      };
    }
  }, [disconnectSocket, setConnectionStatus, socket]);

  const sendMessage = () => {
    socket?.send("Hello how are you???");
  };

  const onCloseSocket = () => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  };

  const connectSocket = () => {
    const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}` + "/ws";
    const socket = new WebSocket(url);
    setSocket(socket);
  };
  return (
    <div>
      <p>Hello Socket!</p>
      <button onClick={connectSocket}>Connect</button>
      <button onClick={sendMessage}>Send</button>
      <button onClick={onCloseSocket}>Close</button>
      {messages.map((m, index) => {
        return <div key={index}>{m}</div>;
      })}
    </div>
  );
}
