const listsRepository = require("../repository/listsRepository");

exports.createList = async (req, res) => {
  try {
    const { name, items } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const list = await listsRepository.createList(userId, name, items);
    res.status(201).json({ message: "List created successfully", list });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllLists = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const lists = await listsRepository.getAllLists(userId);
    res.status(200).json(lists || []);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getListById = async (req, res) => {
  try {
    const listId = req.params.listId;
    const userId = req.user.id;
    const list = await listsRepository.getListById(listId, userId);
    if (!list) {
      return res.status(204).json({ message: "No content" });
    }
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching list by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const { name, items } = req.body;
    const userId = req.user.id; // Assuming user ID is stored in req.user
    const updatedList = await listsRepository.updateList(
      listId,
      userId,
      name,
      items
    );
    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json(updatedList);
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
