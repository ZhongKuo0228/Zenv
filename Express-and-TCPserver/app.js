//---Modules Setting----------------------------------
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//---router----------------------------------------
import { plCodeRouter } from "./routes/api-PLcode.js";
app.use("/api/1.0/PLcode", plCodeRouter);

//---listen-----------------------------------------
import dotenv from "dotenv";
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
