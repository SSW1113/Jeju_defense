import express from "express";
import dotenv from 'dotenv';
import { createServer } from "http";
import initSocket from "./init/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

initSocket(server);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
