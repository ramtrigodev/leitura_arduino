import React from "react";
import ArduinoSerialReader from "./leitura.js";

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ArduinoSerialReader />
    </div>
  );
}

export default App;
