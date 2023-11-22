module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: '0.0.0.0',
        // srv: env.bool('DATABASE_SRV', false),
        port: 27017,
        database: 'real-time_chat',
        // username: env('DATABASE_USERNAME', ''),
        // password: env('DATABASE_PASSWORD', ''),
      },
      // options: {
      //   authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
      //   ssl: env.bool('DATABASE_SSL', false),
      // },
    },
  },
});
