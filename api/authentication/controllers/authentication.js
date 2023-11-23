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
      const accessToken = jwt.sign({ id: _user.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
      const refreshToken = jwt.sign({ id: _user.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

      return ctx.send({ user, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return ctx.send({ message: 'Incorrect email or password.' }, 400);
    }
  },

  async signup(ctx) {
    try {
      const { name, email, password } = ctx.request.body;

      // Check if there is already a user associated with this email
      const _user = await strapi.plugins['users-permissions'].services.user.fetch({ email });
      if (_user) {
        return ctx.send({ message: `The email ${email} is already associated with an account` }, 400);
      }

      // Fetch the role
      const role = await strapi.query('role', 'users-permissions').findOne({ name: 'Authenticated' });

      const payload = {
        username: name,
        email,
        password,
        confirmed: true,
        provider: 'local',
        role: role.id
      };

      const newUser = await strapi.plugins['users-permissions'].services.user.add(payload);
      const user = { name, email }
      const accessToken = jwt.sign({ id: newUser.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
      const refreshToken = jwt.sign({ id: newUser.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

      return ctx.send({ user, accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return ctx.send({ message: 'Incorrect email or password.' }, 400);
    }
  },

  async refreshToken(ctx) {
    try {
      const { email, refreshToken } = ctx.request.body;
      const token = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const isValid = token.user.email === email;
      if (!isValid) {
        return ctx.send({ message: 'Invalid token, try login again.' }, 401);
      }

      const user = { name: token.user.name, email: token.user.email };
      const accessToken = jwt.sign({ id: token.id, user }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });

      return ctx.send({ user, accessToken });
    } catch (error) {
      console.log(error);
      return ctx.send({ message: 'Invalid token, try login again' }, 401);
    }
  }
};
