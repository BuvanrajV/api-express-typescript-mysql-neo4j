import express from "express";
import routes from "./routes/routes";
import { port } from "./config/config";

const app = express();
app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
