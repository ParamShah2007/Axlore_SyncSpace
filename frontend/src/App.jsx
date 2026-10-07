import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
      setConnected(false);
    });

    socket.on("room-joined", (data) => {
      console.log(data.message);
      setJoinedRoom(data.roomId);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-joined");
    };
  }, []);

  const joinRoom = () => {
    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }

    socket.emit("join-room", roomId.trim());
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>SyncSpace</h1>

      <p>Real-Time Collaborative Workspace</p>

      <h3>
        Server Status:{" "}
        <span>
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </h3>

      <hr />

      <h2>Join Collaboration Room</h2>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button onClick={joinRoom}>
        Join Room
      </button>

      {joinedRoom && (
        <h3>
          ✅ Joined Room: {joinedRoom}
        </h3>
      )}
    </div>
  );
}

export default App;