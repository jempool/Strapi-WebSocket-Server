module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 3000),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '99e1a0b72dbd7606e50288983cd743f3'),
    },
    autoOpen: false,
  },
});
