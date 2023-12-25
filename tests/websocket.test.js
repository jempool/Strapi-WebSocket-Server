'use strict';

const http = require('http');
const socketIOClient = require('socket.io-client');
const socketIOServer = require('socket.io');

describe('WebSocket Functionality', () => {
  let ioServer;
  let socketClient;

  // Start a WebSocket server before tests
  beforeAll((done) => {
    const httpServer = http.createServer().listen();
    ioServer = socketIOServer(httpServer);
    global.strapi = {
      io: ioServer,
      services: {
        message: {
          create: jest.fn().mockResolvedValue({})
        }
      }
    };

    ioServer.on('connection', (socket) => {
      // Listening for chat event
      socket.on('chat', (data) => {
        strapi.services.message.create(data);
        ioServer.sockets.emit('chat', data);
      });

      // Listening for typing event
      socket.on('typing', (data) => {
        ioServer.sockets.emit('typing', data);
        socket.broadcast.emit('typing', data);
      });
    });

    const port = httpServer.address().port;
    socketClient = socketIOClient.connect(`http://0.0.0.0:${port}`);
    socketClient.on('connect', done);
  });

  // Disconnect WebSocket client and shutdown the server after tests
  afterAll(() => {
    ioServer.close();
    socketClient.close();
  });

  it('should handle chat messages', (done) => {
    const messageData = { handle: 'User', message: 'Hello, everyone!' };

    // Setup server to expect 'chat' event and respond
    socketClient.on('chat', (data) => {
      expect(data).toEqual(messageData);
      expect(strapi.services.message.create).toHaveBeenCalledWith(messageData);
      done();
    });

    // Emit 'chat' event from client
    socketClient.emit('chat', messageData);
  });

  it('should handle typing notifications', (done) => {
    const typingData = { handle: 'User is typing...' };

    // Setup server to expect 'typing' event and respond
    socketClient.on('typing', (data) => {
      expect(data).toEqual(typingData);
      done();
    });

    // Emit 'typing' event from client
    socketClient.emit('typing', typingData);
  });
});
