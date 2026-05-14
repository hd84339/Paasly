import {
    BrowserRouter,
    Routes, 
    Route,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CreateShop from "../pages/CreateShop/CreateShop";
import Dashboard from "../pages/Dashboard/Dashboard";

import Landing from "../pages/Landing/Landing";

function AppRoutes() {

    return (
        <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        
        <Route
        path="/create-shop"
        element={<CreateShop/>}
        />

        <Route
        path="/dashboard"
        element={<Dashboard/>}
        />

        </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;