/**
 * 
 * Detta är en testfil för att kontrollera att IO-funktionen fungerar som den ska.
 * Kan tas bort när det är kontrollerat.a
 * //Emil 
 * 
 */


import React, { useEffect, useState } from 'react'; // Import necessary modules from React
import io from 'socket.io-client'; // Import the socket.io client library

// Establish a socket connection to the server at the specified URL
const socket = io.connect('http://localhost:3000');

export default function Receive() {
  const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message
  
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receive_message", (data) => {
      console.log(data); // Log the received message data to the console
      setReceiveMessage(data); // Set the received message data to state
    });

    // Cleanup the effect by removing the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <p>View Receive messages: {receiveMessage}</p> {/* Display the received message */}
    </div>
  );
}