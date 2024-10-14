import express from "express";
import dotenv from 'dotenv';
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { serverAssetManager } from "./init/assets.js";


dotenv.config();

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

initSocket(server, "http", "localhost", 8080);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await serverAssetManager.loadGameAssets();
    console.log(assets);
    console.log("성공");
} catch (error) {
    console.error("err: "+error.message)
}
});
