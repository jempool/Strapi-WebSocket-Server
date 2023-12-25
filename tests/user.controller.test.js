const controller = require('../api/user/controllers/user');

const user = {
  name: 'testUser',
  email: 'test@gmail.com',
  password: 'password123',
};

// Mock the global 'strapi' object
global.strapi = {
  services: {
    user: {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    // Mock the user services using Jest
    strapi.services.user.create = jest.fn();
    strapi.services.user.find = jest.fn();
    strapi.services.user.findOne = jest.fn();
  });

  it('should create a new user', async () => {
    // Arrange
    const ctx = {
      request: {
        body: { ...user },
      },
    };
    const newUser = { id: 'user-id', ...user };
    strapi.services.user.create.mockResolvedValue(newUser);

    // Act
    const result = await controller.create(ctx);

    // Assert
    expect(strapi.services.user.create).toHaveBeenCalledWith(user);
    expect(result).toBe(newUser);
  });

  it('should get all users', async () => {
    // Arrange
    const users = [user];
    strapi.services.user.find.mockResolvedValue(users);

    // Act
    const result = await controller.find();

    // Assert
    expect(strapi.services.user.find).toHaveBeenCalled();
    expect(result).toBe(users);
  });

  it('should get a specific user by id', async () => {
    // Arrange
    const id = user.email;
    const ctx = { params: { id } };
    strapi.services.user.findOne.mockResolvedValue(user);

    // Act
    const result = await controller.findOne(ctx);

    // Assert
    expect(strapi.services.user.findOne).toHaveBeenCalledWith({ id });
    expect(result).toBe(user);
  });
});
