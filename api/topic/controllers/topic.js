const moment = require('moment');

module.exports = {
  // Create a new topic
  create: async (ctx) => {
    const { content } = ctx.request.body;
    const newTopic = await strapi.services.topic.create({ content });
    return newTopic;
  },

  // Get all topics
  find: async (ctx) => {
    const topics = await strapi.services.topic.find();
    return topics;
  },

  // Get a specific topic (today's topic)
  findTodaysTopic: async (ctx) => {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const topic = await strapi.services.topic.findOne({
      forDate_gte: startOfToday.toISOString()
    });
    return { topic: topic.topic };
  },

  // Update a topic
  update: async (ctx) => {
    const { id } = ctx.params;
    const { content } = ctx.request.body;
    const updatedTopic = await strapi.services.topic.update({ id }, { content });
    return updatedTopic;
  },

  // Delete a topic
  delete: async (ctx) => {
    const { id } = ctx.params;
    const deletedTopic = await strapi.services.topic.delete({ id });
    return deletedTopic;
  },
};
