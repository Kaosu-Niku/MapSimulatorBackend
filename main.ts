import express from "express";
import path from "path";
import http from "http"

const app = express()
const cors = require('cors')   //引入cors解决跨域问题
app.use(cors());


const port = 3000;

app.use(express.json());

import enemyRoutes from "./src/routes/enemy"
import characterRoutes from "./src/routes/character"
import assetsRoutes from "./src/routes/assets"

app.use("/enemy", enemyRoutes)
app.use("/character", characterRoutes)
app.use("/assets", assetsRoutes)

//设置静态资源
app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app);
server.listen(port);
server.on('listening', () =>{
  console.log(`app listening on port ${port}`);
});
server.on('error', (error) =>{
  console.log(error);
});
module.exports = app;