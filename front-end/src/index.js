import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import App from "./App";
import AuthPage from "./pages/AuthPage/AuthPage";
import Profile from "./pages/Profile/Profile";
import PLpage from "./pages/PLcode/PLcode";
import Express from "./pages/Express/Express";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='profile/' element={<Home />}></Route>
            <Route element={<App />}>
                <Route path='profile/:username' element={<Profile />} />
                <Route path='prog_lang_page/:username/:projectName' element={<PLpage />} />
                <Route path='web-services/:username/:projectName' element={<Express />} />
            </Route>
            <Route path='/auth-page' element={<AuthPage />}></Route>
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    </BrowserRouter>
);
