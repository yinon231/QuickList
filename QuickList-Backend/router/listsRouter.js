const { Router } = require("express");
const listsController = require("../controller/listsController");
const listsRouter = new Router();

listsRouter.post("/", listsController.createList);
listsRouter.get("/", listsController.getAllLists);
// listsRouter.post("/:listId/items", listsController.addItemsToList);
// listsRouter.put("/:listId/items/:itemId", listsController.updateItemInList);
// listsRouter.delete("/:listId/items/:itemId", listsController.deleteItemFromList);
//listsRouter.delete("/:listId", listsController.deleteList);
listsRouter.put("/:listId", listsController.updateList);
listsRouter.get("/:listId", listsController.getListById);
module.exports = listsRouter;
