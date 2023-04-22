import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App";
import Profile from "./pages/Profile/Profile";
import PLpage from "./pages/PLcode/PLcode";
import Express from "./pages/Express/Express";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />}>
                <Route path='profile/:username' element={<Profile />} />
                <Route path='PLpage/:username/:projectName' element={<PLpage />} />
                <Route path='webServices/:username/:projectName' element={<Express />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
