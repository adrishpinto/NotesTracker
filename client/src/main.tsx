import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes and Route
import "./index.css";
import App from "./App.tsx";
import Home from "./Home.tsx";
import Login from "./Login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Main app route */}
        <Route path="/home" element={<Home />} /> {/* Route for Home */}
        <Route path="/login" element={<Login />} /> {/* Route for Home */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
