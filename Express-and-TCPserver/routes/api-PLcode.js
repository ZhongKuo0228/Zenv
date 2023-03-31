import express from "express";
const plCodeRouter = express.Router();
//---router----------------------------------------------
plCodeRouter.get("/nodejs", async (req, res, next) => {
    res.status(200).json({ data: "good" });
});
plCodeRouter.post("/nodejs", async (req, res, next) => {
    const code = req.body.code;
    console.log(code);
    res.status(200).json({ data: code });
});
//---export----------------------------------------------
export { plCodeRouter };
