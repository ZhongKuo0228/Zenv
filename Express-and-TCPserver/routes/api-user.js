import express from "express";
import {
    checkCreateEmail,
    checkCreateInput,
    createMember,
    checkEmailAndPassword,
    resUserAPI,
    checkSigninInput,
    profileAPI,
    checkCreateName,
} from "../controllers/user.js";
//----------------------</Router>----------------------------

const userApiRouter = express.Router();
userApiRouter.use(express.json());

userApiRouter.post("/signup", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.name;
    const checkInput = await checkCreateInput(email, password, userName);
    if (checkInput == 1) {
        const errorMessage = "Error:400,輸入的資料不可爲空值";
        const err = { errorMessage: errorMessage };
        res.send(err);
        res.statusCode = 400;
        return;
    } else if (checkInput == 2) {
        const errorMessage = "Error:400,email格式不符";
        const err = { errorMessage: errorMessage };
        res.send(err);
        res.statusCode = 400;
        return;
    } else if (checkInput == 3) {
        const errorMessage = "Error:400,輸入密碼長度不能小於8碼";
        const err = { errorMessage: errorMessage };
        res.send(err);
        res.statusCode = 400;
        return;
    }

    //檢查email是否有被註冊過
    const checkEmailResult = await checkCreateEmail(email);
    if (checkEmailResult == "nativeExisted") {
        const errorMessage = "Error:403,此email在已native被註冊";
        const err = { errorMessage: errorMessage };
        res.send(err);
        res.statusCode = 403;
        return;
    }

    const checkNameResult = await checkCreateName(userName);
    if (checkNameResult == "nativeExisted") {
        const errorMessage = "Error:403,此使用者名稱已被使用";
        const err = { errorMessage: errorMessage };
        res.send(err);
        res.statusCode = 403;
        return;
    }
    //確認資料無誤，寫入資料
    await createMember(email, password, userName);
    //進入註冊完成後直接登入
    await checkEmailAndPassword(email, password);
    //回傳登入訊息
    const sendUserData = await resUserAPI(email);
    const result = { data: sendUserData };
    return res.send(result);
});

userApiRouter.post("/signin", async (req, res, next) => {
    const provider = req.body.provider;
    if (provider == "native") {
        const email = req.body.email;
        const password = req.body.password;
        //檢查輸入的資料內容
        //檢查輸入的資料是否爲空值
        const signinInput = await checkSigninInput(email, password);
        if (signinInput == false) {
            const errorMessage = "Error:400,輸入的資料不可爲空值";
            const err = { errorMessage: errorMessage };
            res.send(err);
            res.statusCode = 400;
            return;
        } else {
            const signinResult = await checkEmailAndPassword(email, password);
            if (signinResult == 4) {
                const errorMessage = "Error:403,登入失敗，輸入email查詢不到";
                const err = { errorMessage: errorMessage };
                res.send(err);
                res.statusCode = 403;
                return;
            } else if (signinResult == 5) {
                const errorMessage = "Error:403,登入失敗，輸入密碼錯誤";
                const err = { errorMessage: errorMessage };
                res.send(err);
                res.statusCode = 403;
                return;
            } else {
                //回傳登入訊息
                const sendUserData = await resUserAPI(email);
                const result = { data: sendUserData };
                return res.send(result);
            }
        }
    } else {
        res.send("Error:500,服務器錯誤回應");
        res.statusCode = 500;

        return;
    }
});

userApiRouter.get("/profile", async (req, res, next) => {
    const getToke = req.headers.authorization;
    //獲取 Authorization 標頭，並確認其是否為 Bearer Token
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
        const result = { data: data };
        return res.send(result);
    }
});

//----------------------<reference app.js>---------------------
export { userApiRouter };
