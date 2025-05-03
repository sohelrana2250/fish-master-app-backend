import { Server } from 'http';


import app from './app';
import config from './app/config';

let server: Server;

async function main() {
  try {
    
    console.log('Successfully connected to Firsebase');
  
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect:', err);
  }
}

main().then(() => {
  console.log('Successfully Server Running');
});

// Graceful shutdown on unhandledRejection
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on uncaughtException
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
