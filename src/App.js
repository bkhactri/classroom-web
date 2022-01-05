// import React, { useRef, useEffect } from "react";
import "./App.css";
import AppRouter from "./routes/index.routes";
import { BrowserRouter } from "react-router-dom";
// import socketIOClient from "socket.io-client";

const App = () => {
  // const socketRef = useRef();

  // useEffect(() => {
  //   socketRef.current = socketIOClient.connect(
  //     process.env.REACT_APP_API_END_POINT
  //   );

  //   socketRef.current.on("getSocketIdFromServer", (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
