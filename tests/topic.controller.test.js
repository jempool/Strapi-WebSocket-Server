const moment = require('moment');
const controller = require('../api/topic/controllers/topic');

// Mock the global 'strapi' object
global.strapi = {
  services: {
    topic: {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn()
    }
  }
};

describe('Topic Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(moment.prototype, 'utc').mockReturnValue({
      startOf: jest.fn().mockReturnThis(),
      toISOString: jest.fn().mockReturnValue(new Date(2023, 3, 14).toISOString()) // Mocked UTC date for the test
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore the original functionality after each test case
  });

  it('should create a new topic', async () => {
    // Arrange
    const content = 'New Topic Content';
    const ctx = {
      request: {
        body: { content },
      },
    };
    const newTopic = { id: 'topic-id', topic: content };
    strapi.services.topic.create.mockResolvedValue(newTopic);

    // Act
    const result = await controller.create(ctx);

    // Assert
    expect(strapi.services.topic.create).toHaveBeenCalledWith({ content });
    expect(result).toBe(newTopic);
  });

  it('should get all topics', async () => {
    // Arrange
    const topics = [{ id: 'topic-id', topic: 'Existing Topic Content' }];
    strapi.services.topic.find.mockResolvedValue(topics);

    // Act
    const result = await controller.find();

    // Assert
    expect(strapi.services.topic.find).toHaveBeenCalled();
    expect(result).toBe(topics);
  });

  it("should get today's topic", async () => {
    // Arrange
    const todayTopic = { id: 'today-topic-id', topic: "Today's Topic Content", forDate: new Date().toISOString() };
    strapi.services.topic.findOne.mockResolvedValue(todayTopic);

    // Act
    const result = await controller.findTodaysTopic();

    // Assert
    expect(strapi.services.topic.findOne).toHaveBeenCalledWith({
      forDate_gte: expect.any(String)
    });
    expect(result).toEqual({ topic: todayTopic.topic });
  });
});

