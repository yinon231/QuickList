const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

require("./dbConnection");
const authRoutes = require("./router/authRouter");
const listsRouter = require("./router/listsRouter");
const verifyJwt = require("./middleware/verifyJwtAccessToken");

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to QuickList Backend",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/lists", verifyJwt, listsRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
