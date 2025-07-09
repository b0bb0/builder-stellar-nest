import { createHttpServer } from "./index";

const server = createHttpServer();
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`🛡️  LUMINOUS FLOW Scanner running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`📡 WebSocket: ws://localhost:${port}/ws`);
  console.log(`🔍 Health: http://localhost:${port}/api/health`);
});

// The graceful shutdown is already handled in createHttpServer
