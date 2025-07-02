import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedAdminPanel from "./components/ProtectedAdminPanel";
import ProductList from "./components/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/admin" element={<ProtectedAdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
