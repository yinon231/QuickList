const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  checked: { type: Boolean, default: false },
});
const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: { type: [itemSchema], default: [] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});
module.exports = mongoose.model("lists", listSchema);
