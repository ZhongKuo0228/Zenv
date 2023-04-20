import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App";
import PLpage from "./pages/PLcode/PLcode";
import Express from "./pages/Express/Express";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />}>
                <Route path='PLpage/:username/:projectName' element={<PLpage />} />
                <Route path='Express' element={<Express />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
