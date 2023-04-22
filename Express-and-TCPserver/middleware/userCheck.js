//TODO:使用者身份認證
import { profileAPI } from "../controllers/user.js";
async function userCheck(req, res, next) {
    const getToke = req.headers.authorization;
    if (!getToke || !getToke.startsWith("Bearer ")) {
        const errorMessage = "Error:403,非正確token種類";
        const err = { errorMessage: errorMessage };
        res.statusCode = 401;
        res.send(err);
        return;
    }
    //獲取 Bearer Token，並輸出到控制台中
    const bearerToken = getToke.slice("Bearer ".length);
    const data = await profileAPI(bearerToken);
    if (data == 6) {
        const errorMessage = "Error:403,錯誤的token";
        const err = { errorMessage: errorMessage };
        res.statusCode = 403;
        res.send(err);
        return;
    } else {
        const userName = data.name;
        const userID = data.id;
        req.user = { userID: userID, name: userName };
        next();
    }
}

export { userCheck };
