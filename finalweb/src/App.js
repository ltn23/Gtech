import React from "react";

import MasterLayout from "./layouts/MasterLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
// import UploadImage from "./components/UploadImage";
// import Login from "./components/frontend/Auth/Login";
// import Register from "./components/frontend/Auth/Register";
// import Home from "./components/frontend/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path="/home" element={Home} />
          <Route path="/login" element={Login} />
          <Route path="/register" element={Register} /> */}
          {/* <Route path="/uploadimage" element={<UploadImage />} /> */}
          <Route path="/*" element={<MasterLayout />} />
        </Routes>
        {/* <MasterLayout /> */}
      </Router>
    </div>
  );
}

export default App;
