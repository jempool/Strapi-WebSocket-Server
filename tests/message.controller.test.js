const controller = require('../api/message/controllers/message');

global.strapi = {
  services: {
    message: {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
};

describe('Message Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    strapi.services.message.create = jest.fn();
    strapi.services.message.find = jest.fn();
    strapi.services.message.findOne = jest.fn();
    strapi.services.message.update = jest.fn();
    strapi.services.message.delete = jest.fn();
  });

  it('should create a new message', async () => {
    // Arrange
    const content = 'Hello world';
    const ctx = {
      request: {
        body: { content },
      },
    };
    const newMessage = { id: 'message-id', content };
    strapi.services.message.create.mockResolvedValue(newMessage);

    // Act
    const result = await controller.create(ctx);

    // Assert
    expect(strapi.services.message.create).toHaveBeenCalledWith({ content });
    expect(result).toBe(newMessage);
  });

  it('should get all messages', async () => {
    // Arrange
    const messages = [{ id: 'message-id', content: 'Hello' }];
    strapi.services.message.find.mockResolvedValue(messages);

    // Act
    const result = await controller.find();

    // Assert
    expect(strapi.services.message.find).toHaveBeenCalled();
    expect(result).toBe(messages);
  });

  it('should get a specific message by id', async () => {
    // Arrange
    const id = 'message-id';
    const ctx = { params: { id } };
    const message = { id, content: 'Hello' };
    strapi.services.message.findOne.mockResolvedValue(message);

    // Act
    const result = await controller.findOne(ctx);

    // Assert
    expect(strapi.services.message.findOne).toHaveBeenCalledWith({ id });
    expect(result).toBe(message);
  });

  it('should update a message', async () => {
    // Arrange
    const id = 'message-id';
    const content = 'Updated Hello';
    const ctx = {
      params: { id },
      request: { body: { content } },
    };
    const updatedMessage = { id, content };
    strapi.services.message.update.mockResolvedValue(updatedMessage);

    // Act
    const result = await controller.update(ctx);

    // Assert
    expect(strapi.services.message.update).toHaveBeenCalledWith({ id }, { content });
    expect(result).toBe(updatedMessage);
  });

  it('should delete a message', async () => {
    // Arrange
    const id = 'message-id';
    const ctx = { params: { id } };
    const deletedMessage = { id, content: 'Deleted Hello' };
    strapi.services.message.delete.mockResolvedValue(deletedMessage);

    // Act
    const result = await controller.delete(ctx);

    // Assert
    expect(strapi.services.message.delete).toHaveBeenCalledWith({ id });
    expect(result).toBe(deletedMessage);
  });
});
