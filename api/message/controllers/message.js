module.exports = {
  // Create a new message
  create: async (ctx) => {
    const { content } = ctx.request.body;
    const newMessage = await strapi.services.message.create({ content });
    return newMessage;
  },

  // Get all messages
  find: async (ctx) => {
    const messages = await strapi.services.message.find();
    return messages;
  },

  // Get a specific message by id
  findOne: async (ctx) => {
    const { id } = ctx.params;
    const message = await strapi.services.message.findOne({ id });
    return message;
  },

  // Update a message
  update: async (ctx) => {
    const { id } = ctx.params;
    const { content } = ctx.request.body;
    const updatedMessage = await strapi.services.message.update({ id }, { content });
    return updatedMessage;
  },

  // Delete a message
  delete: async (ctx) => {
    const { id } = ctx.params;
    const deletedMessage = await strapi.services.message.delete({ id });
    return deletedMessage;
  },
};
