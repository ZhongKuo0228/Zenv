import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App";
import AuthPage from "./pages/AuthPage/AuthPage";
import Profile from "./pages/Profile/Profile";
import PLpage from "./pages/PLcode/PLcode";
import Express from "./pages/Express/Express";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />}>
                <Route path='/' element={<Navigate to='/profile' />} />
                <Route path='profile/:username' element={<Profile />} />
                <Route path='PLpage/:username/:projectName' element={<PLpage />} />
                <Route path='webServices/:username/:projectName' element={<Express />} />
            </Route>
            <Route path='/AuthPage' element={<AuthPage />}></Route>
        </Routes>
    </BrowserRouter>
);
