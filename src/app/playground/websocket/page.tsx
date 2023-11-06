"use client"
import React from "react"

export default function PlaygroundSocket() {
  const [websckt, setWebsckt] = React.useState<WebSocket>();
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const url = "ws://127.0.0.1:8000/ws";
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
