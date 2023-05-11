import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    checkEmail,
    searchEmail,
    searchPassword,
    createUserData,
    checkUserTable,
    checkName,
} from "../models/db-user.js";
import { timestamp } from "../util/timestamp.js";
import { getUserPLProjects } from "../models/db-PLcode.js";
import { getUserWebProjects } from "../models/db-webServices.js";

//---Web signUp------------------------------------------------
export async function checkCreateInput(email, password, userName) {
    try {
        //檢查輸入的資料內容
        //檢查輸入的資料是否爲空值
        if (email.length == 0 || password.length == 0 || userName.length == 0) {
            const errorType = 1;
            return errorType;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            const errorType = 2;
            return errorType;
        } else if (password.length < 8) {
            const errorType = 3;
            return errorType;
        }
    } catch (e) {
        console.error(e);
    }
}
export async function checkCreateEmail(email) {
    try {
        const checkEmailResult = await checkEmail(email);
        if (checkEmailResult == "nativeExisted") {
            return "nativeExisted";
        }
    } catch (e) {
        console.error(e);
    }
}

export async function checkCreateName(name) {
    try {
        const checkNameResult = await checkName(name);
        if (checkNameResult == "nativeExisted") {
            return "nativeExisted";
        }
    } catch (e) {
        console.error(e);
    }
}

export async function createMember(email, password, userName) {
    try {
        //加密密碼
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const time = timestamp();
        await createUserData(email, hashPassword, userName, time);
        return;
    } catch (e) {
        console.error(e);
    }
}

//---Web signIn------------------------------------------------
export async function checkSigninInput(email, password) {
    try {
        if (email.length == 0 || password.length == 0) {
            return false;
        }
    } catch (e) {
        console.error(e);
    }
}

export async function checkEmailAndPassword(email, password) {
    try {
        //將輸入的email查表
        const getEmail = await searchEmail(email);
        if (getEmail == 0) {
            const errorType = 4;
            return errorType;
        } else {
            const dbHashPassword = await searchPassword(email);
            const match = await bcrypt.compare(password, dbHashPassword);
            if (match) {
                const signinResult = await resUserAPI(email);
                return signinResult;
            } else {
                const errorType = 5;
                return errorType;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

//---JWT（JSON Web Token）------------------------------------------------

export async function createJWT(email, time) {
    try {
        const userTable = await checkUserTable(email);
        const payload = {
            id: userTable.id,
            provider: userTable.provider,
            name: userTable.user_name,
            email: userTable.email,
            picture: userTable.picture,
            teaching: userTable.use_teaching,
            role: userTable.role,
        };
        const secret = process.env.JWT_secret;
        const token = jwt.sign(payload, secret, { expiresIn: time });
        return token;
    } catch (e) {
        console.error(e);
    }
}

//---API Format----------------------------------------------------------
export async function resUserAPI(email) {
    try {
        const access_expiredSet = process.env.JWT_time; //token時間設定3600秒
        const access_expired = process.env.JWT_time;
        const jwt = await createJWT(email, access_expiredSet); //產生jwt的
        const user = await profileAPI(jwt);

        const access_token = jwt;
        return { access_token, access_expired, user };
    } catch (e) {
        console.error(e);
    }
}

export async function profileAPI(token) {
    try {
        const secret = process.env.JWT_secret;
        const data = jwt.verify(token, secret);
        delete data.iat;
        delete data.exp;
        return data;
    } catch {
        const errorType = 6;
        return errorType;
    }
}

//---UserProject------------------------------------------------------
export async function userProjects(jwt) {
    try {
        const user = await profileAPI(jwt);
        const userId = user.id;
        const plProjects = await getUserPLProjects(userId);
        const plProjectDetails = plProjects.map((project) => {
            const createTime = new Date(project.create_time)
                .toISOString()
                .replace("T", " ")
                .replace("Z", "")
                .substring(0, 16);
            return {
                project_name: project.project_name,
                state: project.permissions,
                create_time: createTime,
                items: project.items,
                itemType: "prog_lang",
            };
        });

        const webProjects = await getUserWebProjects(userId);
        const webProjectDetails = webProjects.map((project) => {
            const createTime = new Date(project.create_time)
                .toISOString()
                .replace("T", " ")
                .replace("Z", "")
                .substring(0, 16);
            return {
                project_name: project.project_name,
                state: project.state,
                create_time: createTime,
                items: project.items,
                itemType: "web",
            };
        });

        const allProjects = plProjectDetails.concat(webProjectDetails);
        return allProjects;
    } catch {
        const errorType = 6;
        return errorType;
    }
}

//---For API---------------------------------------------------
export async function signUp(req, res, next) {
    const email = req.body.data.email;
    const password = req.body.data.password;
    const userName = req.body.data.username;
    const checkInput = await checkCreateInput(email, password, userName);
    if (checkInput == 1) {
        return res.status(400).json({ errorMessage: "Input cannot be empty" });
    } else if (checkInput == 2) {
        return res.status(400).json({ errorMessage: "Invalid email format" });
    } else if (checkInput == 3) {
        return res.status(400).json({ errorMessage: "Password length cannot be less than 8 characters" });
    }

    //檢查email是否有被註冊過
    const checkEmailResult = await checkCreateEmail(email);
    if (checkEmailResult == "nativeExisted") {
        return res.status(403).json({ errorMessage: "This email has already been registered natively." });
    }

    const checkNameResult = await checkCreateName(userName);
    if (checkNameResult == "nativeExisted") {
        return res.status(403).json({ errorMessage: "This username has already been taken." });
    }
    //確認資料無誤，寫入資料
    await createMember(email, password, userName);
    //進入註冊完成後直接登入
    await checkEmailAndPassword(email, password);
    //回傳登入訊息
    const sendUserData = await resUserAPI(email);
    return res.status(200).json({ data: sendUserData });
}

export async function signIn(req, res, next) {
    const provider = req.body.data.provider;
    if (provider == "native") {
        const email = req.body.data.email;
        const password = req.body.data.password;
        //檢查輸入的資料內容
        const signinInput = await checkSigninInput(email, password);
        if (signinInput == false) {
            return res.status(400).json({ errorMessage: "Input cannot be empty" });
        } else {
            const signinResult = await checkEmailAndPassword(email, password);
            if (signinResult == 4) {
                return res.status(403).json({ errorMessage: "Login failed. Email not found." });
            } else if (signinResult == 5) {
                return res.status(403).json({ errorMessage: "Login failed. Incorrect password." });
            } else {
                // Return login message
                const sendUserData = await resUserAPI(email);
                return res.status(200).json({ data: sendUserData });
            }
        }
    }
}

export async function getUserProfile(req, res, next) {
    const getToke = req.headers.authorization;
    //獲取 Authorization 標頭，並確認其是否為 Bearer Token
    if (!getToke || !getToke.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "Incorrect token type" });
    }
    //獲取 Bearer Token，並輸出到控制台中
    const bearerToken = getToke.slice("Bearer ".length);
    const data = await profileAPI(bearerToken);
    if (data == 6) {
        return res.status(403).json({ errorMessage: "Invalid token" });
    } else {
        return res.status(200).json({ data: data });
    }
}

export async function getUserProjects(req, res, next) {
    const getToke = req.headers.authorization;
    //獲取 Authorization 標頭，並確認其是否為 Bearer Token
    if (!getToke || !getToke.startsWith("Bearer ")) {
        return res.status(401).json({ errorMessage: "Incorrect token type" });
    }
    //獲取 Bearer Token，並輸出到控制台中
    const bearerToken = getToke.slice("Bearer ".length);
    const data = await userProjects(bearerToken);
    if (data == 6) {
        return res.status(403).json({ errorMessage: "Invalid token" });
    } else {
        return res.status(200).json({ data: data });
    }
}
