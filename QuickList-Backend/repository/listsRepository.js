const lists = require("../models/listModel");
exports.createList = async (userId, name, items) => {
  return await lists.create({
    userId: userId,
    name: name,
    items: items,
  });
};
exports.getAllLists = async (userId) => {
  return await lists.find({ userId: userId });
};
exports.getListById = async (listId, userId) => {
  return await lists.findOne({ _id: listId, userId: userId });
};
exports.updateList = async (listId, userId, name, items) => {
  return await lists.findOneAndUpdate(
    { _id: listId, userId: userId },
    { name: name, items: items },
    { new: true }
  );
};
