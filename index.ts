import http from 'http';
import express from 'express';
import cors from "cors";
import {Server} from 'colyseus';
import serveIndex from 'serve-index';
import { monitor } from '@colyseus/monitor';
import {MyRoom} from "./MyRoom";
import path from "path";

const app = express();
const port = Number(process.env.PORT || 2567);

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server: server,
  express: app
});

gameServer.define('my_room', MyRoom);
gameServer.listen(port);

app.use('/', express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor());


console.log(`Listening on ws://localhost:${port}`);