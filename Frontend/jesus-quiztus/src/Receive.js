/**
 * 
 * Detta är en testfil för att kontrollera att IO-funktionen fungerar som den ska.
 * Kan tas bort när det är kontrollerat.
 * //Emil 
 * 
 */

import React, { useEffect, useState } from 'react'; // Import necessary modules from React
import io from 'socket.io-client'; // Import the socket.io client library

// Establish a socket connection to the server at the specified URL
const socket = io.connect('http://localhost:5002');

export default function Receive() {
  const [messages, setMessages] = useState([]); // State to store all received messages

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receive_message", (data) => {
      console.log("Message received:", data.message);
      console.log("From:", data.senderId);

      // Add new message to the list
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup the effect by removing the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <h2>View Received Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
