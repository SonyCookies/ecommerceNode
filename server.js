require("dotenv").config();
const app = require("./app/configs/app.conf");
const { connectDB } = require("./app/configs/db.conf");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
};

startServer();
