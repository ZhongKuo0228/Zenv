//---Modules Setting----------------------------------
import express from "express";
import cors from "cors";
import { plCodeRouter } from "./routes/api-PLcode.js";
import dotenv from "dotenv";
// function expressServer() {
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//---router----------------------------------------

app.use("/api/1.0/PLcode", plCodeRouter);

//---listen-----------------------------------------
dotenv.config();
app.listen(process.env.EXPRESS_SERVER_PORT, () => {
    console.log("Express Server Is Running!");
});
//---view-------------------------------------------
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", function (req, res, next) {
    res.render("index.ejs");
});
// }
// //---export---------------------------------------------
// export default expressServer;
