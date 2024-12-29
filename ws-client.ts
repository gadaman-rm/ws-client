#!/usr/bin/env node

import WebSocket from "ws";
import { argv } from "process";

// Parse arguments
const [ip, port, ...messageArgs] = argv.slice(2);

// Validate inputs
if (!ip || !port || messageArgs.length === 0) {
  console.error("Usage: npx <package-name> <IP> <PORT> <JSON message>");
  process.exit(1);
}

// The message argument should be a valid JSON string
let message;
try {
  message = JSON.parse(messageArgs.join(" "));
} catch (error: any) {
  console.error("Invalid JSON message:", error.message);
  process.exit(1);
}

// Construct the WebSocket URL
const wsUrl = `ws://${ip}:${port}`;

// Create a WebSocket client
const ws = new WebSocket(wsUrl);

ws.on("open", () => {
  console.log(`Connected to WebSocket server at ${wsUrl}`);
  console.log("Sending message:", JSON.stringify(message));
  ws.send(JSON.stringify(message)); // Send JSON message to server
});

// When a message is received from the server, log it
ws.on("message", (data) => {
  console.log("Received from server:", data.toString());
  ws.close(); // Close the connection after receiving a response
});

// Handle errors
ws.on("error", (err) => {
  console.error("WebSocket Error:", err);
});

// Handle connection closure
ws.on("close", () => {
  console.log("Connection closed");
});
