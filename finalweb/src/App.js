import React from "react";

import MasterLayout from "./layouts/admin/MasterLayout";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <MasterLayout />
      </Router>
    </div>
  );
}

export default App;
