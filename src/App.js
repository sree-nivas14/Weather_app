import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Weather_app from "./components/Weather_app";

function App() {
  return (
    <div className="App">
      <Weather_app />
    </div>
  );
}

export default App;
