'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  process.nextTick(() => {
    const io = require('socket.io')(strapi.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", (socket) => {
      console.log(`${new Date()} - New connection ${socket.id}`);

      // Listening for chat event
      socket.on("chat", function (data) {
        strapi.services.message.create(data);
        io.sockets.emit("chat", data);
      });

      // Listening for typing event
      socket.on("typing", function (data) {
        io.sockets.emit("typing", data);
        socket.broadcast.emit("typing", data);
      });
    });

    strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  })

};
