import React, { useState } from "react";

const ArduinoSerialReader = () => {
  const [port, setPort] = useState(null);
  const [reader, setReader] = useState(null);
  const [data, setData] = useState("Aguardando dados...");

  const connectToSerial = async () => {
    try {
      const serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 9600 });
      setPort(serialPort);
      readData(serialPort);
    } catch (err) {
      console.error("Erro ao conectar:", err);
    }
  };

  const readData = async (serialPort) => {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
    const textReader = textDecoder.readable.getReader();
    setReader(textReader);

    try {
      while (true) {
        const { value, done } = await textReader.read();
        if (done) break;
        setData(value);
      }
    } catch (err) {
      console.error("Erro ao ler dados:", err);
    } finally {
      textReader.releaseLock();
    }
  };

  const disconnectSerial = async () => {
    if (reader) {
      await reader.cancel();
    }
    if (port) {
      await port.close();
    }
    setPort(null);
    setReader(null);
    setData("Desconectado");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Leitor de Dados do Arduino</h1>
      <p className="mt-2">Dados: {data}</p>
      <div className="mt-4">
        {!port ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={connectToSerial}
          >
            Conectar
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={disconnectSerial}
          >
            Desconectar
          </button>
        )}
      </div>
    </div>
  );
};

export default ArduinoSerialReader;
