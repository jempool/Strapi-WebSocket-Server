module.exports = {
  // Create a new user
  create: async (ctx) => {
    const { name, email, password } = ctx.request.body;
    const newUser = await strapi.services.user.create({ name, email, password });
    return newUser;
  },

  // Get all users
  find: async (ctx) => {
    const users = await strapi.services.user.find();
    return users;
  },

  // Get a specific user by id
  findOne: async (ctx) => {
    const { id } = ctx.params;
    const user = await strapi.services.user.findOne({ id });
    return user;
  },

  // Update a user
  update: async (ctx) => {
    const { id } = ctx.params;
    const { name, email, password } = ctx.request.body;
    const updatedUser = await strapi.services.user.update({ id }, { name, email, password });
    return updatedUser;
  },

  // Delete a user
  delete: async (ctx) => {
    const { id } = ctx.params;
    const deletedUser = await strapi.services.user.delete({ id });
    return deletedUser;
  },
};
