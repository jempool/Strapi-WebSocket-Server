module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: '0.0.0.0',
        port: 27017,
        database: 'real-time_chat',
      },
    },
  },
});
