const jwt = require('jsonwebtoken');

module.exports = {
  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;

      // Validate the user's credentials
      const _user = await strapi.plugins['users-permissions'].services.user.fetch({ email });
      const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, _user.password);

      if (!validPassword) {
        return ctx.send({ error: 'Invalid credentials' }, 401);
      }

      const user = { name: _user.username, email }
      const accessToken = strapi.plugins['users-permissions'].services.jwt.issue({ id: _user.id, user });
      const refreshToken = jwt.sign({ id: _user.id, user }, process.env.JWT_SECRET, { expiresIn: '1d' });

      return ctx.send({ user, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return ctx.send({ message: 'Incorrect email or password.' }, 400);
    }
  },
};
