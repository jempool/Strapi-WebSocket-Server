const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const controller = require('../api/authentication/controllers/authentication');

// Create mocks
const strapiMock = {
  plugins: {
    'users-permissions': {
      services: {
        user: {
          fetch: sinon.stub(),
          validatePassword: sinon.stub(),
          add: sinon.stub(),
        },
      },
    },
  },
  query: sinon.stub(),
};
global.strapi = strapiMock;

describe('Authentication Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    sinon.restore();
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    // Restore console.log to its original function
    console.log.mockRestore();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 'user-id', username: 'testUser', password };
      const ctx = {
        request: {
          body: { email, password },
        },
        send: jest.fn(),
      };
      process.env.JWT_SECRET = 'secret';
      process.env.ACCESS_TOKEN_EXPIRES_IN = '1h';
      process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';

      strapiMock.plugins['users-permissions'].services.user.fetch.resolves(user);
      strapiMock.plugins['users-permissions'].services.user.validatePassword.resolves(true);
      jwt.sign = jest.fn().mockReturnValue('token');

      // Act
      await controller.login(ctx);

      // Assert
      expect(ctx.send).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { name: user.username, email },
          accessToken: 'token',
          refreshToken: 'token',
        })
      );
    });

    it('should respond with an error for invalid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const user = { id: 'user-id', username: 'testUser', password: 'correctHashedPassword' };
      const ctx = {
        request: {
          body: { email, password },
        },
        send: jest.fn(),
      };
      process.env.JWT_SECRET = 'secret';
      process.env.ACCESS_TOKEN_EXPIRES_IN = '1h';
      process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';

      strapiMock.plugins['users-permissions'].services.user.fetch.resolves(user);
      strapiMock.plugins['users-permissions'].services.user.validatePassword.resolves(false);

      // Act
      await controller.login(ctx);

      // Assert
      expect(ctx.send).toHaveBeenCalledWith(
        { error: 'Invalid credentials' },
        401
      );
    });

    it('should handle exceptions correctly', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const ctx = {
        request: {
          body: { email, password },
        },
        send: jest.fn(),
      };

      strapiMock.plugins['users-permissions'].services.user.fetch.rejects(new Error('An unexpected error occurred'));

      // Act
      await controller.login(ctx);

      // Assert
      expect(ctx.send).toHaveBeenCalledWith(
        { message: 'Incorrect email or password.' },
        400
      );
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('signup', () => {
    beforeEach(() => {
      // Common setup for the tests in this block
      jest.resetAllMocks();
      sinon.restore();
      strapi.query = jest.fn().mockReturnValue({
        findOne: {
          resolves: jest.fn()
        }
      });
    });

    it('should respond with an error for invalid credentials', async () => {
      const name = 'testUser';
      const email = 'taken@example.com'; // Simulate email already taken
      const password = 'password123';
      const existingUser = { id: 'existing-user-id', username: name, email };
      const ctx = {
        request: {
          body: { name, email, password },
        },
        send: jest.fn(),
      };

      strapiMock.plugins['users-permissions'].services.user.fetch.resolves(existingUser); // Simulate user found with that email

      // Act
      await controller.signup(ctx);

      // Assert
      expect(ctx.send).toHaveBeenCalledWith(
        { message: `The email ${email} is already associated with an account` },
        400
      );
    });

    it('should handle exceptions correctly', async () => {
      // Arrange
      const name = 'testUser';
      const email = 'test@example.com';
      const password = 'password123';
      const ctx = {
        request: {
          body: { name, email, password },
        },
        send: jest.fn(),
      };

      strapiMock.plugins['users-permissions'].services.user.fetch.rejects(new Error('An unexpected error occurred'));

      // Act
      await controller.signup(ctx);

      // Assert
      expect(ctx.send).toHaveBeenCalledWith(
        { message: 'Incorrect email or password.' },
        400
      );
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
