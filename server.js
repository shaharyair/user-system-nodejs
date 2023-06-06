const app = require("./app");
const connectToDatabase = require("./db/db");
require("dotenv").config();

const port = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
});
