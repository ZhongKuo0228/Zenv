import { profileAPI } from "../controllers/user.js";

async function userCheck(req, res, next) {
    try {
        const getToke = req.headers.authorization;
        if (!getToke || !getToke.startsWith("Bearer ")) {
            return res.status(401).json({ errorMessage: "Incorrect token type" });
        }
        //獲取 Bearer Token，並輸出到控制台中
        const bearerToken = getToke.slice("Bearer ".length);
        const data = await profileAPI(bearerToken);
        if (data == 6) {
            return res.status(403).json({ errorMessage: "Invalid token" });
        } else {
            const userName = data.name;
            const userID = data.id;
            req.user = { userID: userID, name: userName };
            next();
        }
    } catch (e) {
        console.error(e);
    }
}




export { userCheck };
