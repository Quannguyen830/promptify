import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./api/root";
import { createWSContext } from "./api/trpc";

declare global {
  // eslint-disable-next-line no-var
  var wssInstance: WebSocketServer | null;
}
const WSS_PORT=3001

function closeWSSServer() {
  if (global.wssInstance) {
    console.log("Closing WebSocket server...");
    try {
      global.wssInstance.close((err) => {
        if (err) {
          console.error("Error closing WebSocket server:", err);
        } else {
          console.log("WebSocket server closed successfully");
          global.wssInstance = null;
        }
      });
    } catch (error) {
      console.error("Exception while closing WebSocket server:", error);
    }
  } else {
    console.log("No WebSocket server instance to close");
  }
}

export function createWSServer() {
  console.log("Starting createWSServer function...");
  
  if (global.wssInstance) {
    console.log(`WebSocket Server instance already exists (clients: ${global.wssInstance.clients.size})`);
    return global.wssInstance;
  }
  
  try {
    console.log(`Creating WebSocket server on port ${WSS_PORT}...`);
    global.wssInstance = new WebSocketServer({ port: WSS_PORT });
    
    const handler = applyWSSHandler({
      wss: global.wssInstance,
      router: appRouter,
      createContext: createWSContext,
    });
    
    global.wssInstance.on("connection", (ws) => {
      console.log(`➕ Connection (${global.wssInstance?.clients.size ?? 0})`);
      ws.once("close", () => {
        console.log(`➖ Connection (${global.wssInstance?.clients.size ?? 0})`);
      });
    });
    
    // global.wssInstance.on("error", (error) => {
    //   console.error("WebSocket Server Error:", error);
    // });
    
    // Handle multiple termination signals
    ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach(signal => {
      process.on(signal, () => {
        console.log(`${signal} received, closing WebSocket server`);
        if (handler && typeof handler.broadcastReconnectNotification === 'function') {
          handler.broadcastReconnectNotification();
        }
        closeWSSServer();
      });
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      // console.error('Uncaught Exception:', error);
      closeWSSServer();
    });
    
    console.log("✅ WebSocket Server listening on ws://localhost:3001");
    return global.wssInstance;
    
  } catch (error) {
    console.error("Failed to create WebSocket server:", error);
    return null;
  }
}

// For cleanup during development/testing
export function forceCloseWSServer() {
  closeWSSServer();
}
