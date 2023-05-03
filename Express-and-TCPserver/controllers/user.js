import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    checkEmail,
    searchEmail,
    searchPassword,
    createUserData,
    checkSignIn,
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
        console.log(email, password, userName);
        if (email.length == 0 || password.length == 0 || userName.length == 0) {
            console.log("輸入的資料不可爲空值");
            const errorType = 1;
            return errorType;
        } else if (email.includes("@") == false || email.includes(".") == false) {
            //檢查email格式;
            console.log("email格式不符");
            const errorType = 2;
            return errorType;
        } else if (password.length < 8) {
            //檢查email格式;
            console.log("輸入密碼長度不能小於8碼");
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
            console.log("此email在已native被註冊");
            const err = "nativeExisted";
            return err;
        }
    } catch (e) {
        console.error(e);
    }
}

export async function checkCreateName(name) {
    try {
        const checkNameResult = await checkName(name);
        if (checkNameResult == "nativeExisted") {
            console.log("此使用者名稱已經使用過");
            const err = "nativeExisted";
            return err;
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
        console.log("帳號註冊成功");
        return;
    } catch (e) {
        console.error(e);
    }
}

//---Web signIn------------------------------------------------
export async function checkSigninInput(email, password) {
    try {
        if (email.length == 0 || password.length == 0) {
            console.log("輸入的資料不可爲空值");
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
            console.log("輸入email查詢不到");
            return errorType;
        } else {
            const dbHashPassword = await searchPassword(email);
            const match = await bcrypt.compare(password, dbHashPassword);
            if (match) {
                console.log("解密完成");
                const signinResult = await resUserAPI(email);
                return signinResult;
            } else {
                const errorType = 5;
                console.log("登入失敗，輸入密碼錯誤");
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
            id: `${userTable.id}`,
            provider: `${userTable.provider}`,
            name: `${userTable.user_name}`,
            email: `${userTable.email}`,
            picture: `${userTable.picture}`,
            teaching: `${userTable.use_teaching}`,
            role: `${userTable.role}`,
        };
        const secret = process.env.JWT_secret;
        const token = jwt.sign(payload, secret, { expiresIn: time });
        // console.log(`新創建的toke = ${token}`);
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
        const result = { access_token, access_expired, user };
        return result;
    } catch (e) {
        console.error(e);
    }
}

export async function profileAPI(token) {
    try {
        const secret = process.env.JWT_secret;
        const data = jwt.verify(token, secret);
        console.log("JWT 解析成功：");
        delete data.iat;
        delete data.exp;
        return data;
    } catch {
        console.log("JWT 解析失敗");
        const errorType = 6;
        return errorType;
    }
}

//---UserProject------------------------------------------------------
export async function userProjects(jwt) {
    try {
        const user = await profileAPI(jwt);
        const userId = user.id;
        console.log("userId", userId);
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
        console.log("JWT 解析失敗");
        const errorType = 6;
        return errorType;
    }
}
