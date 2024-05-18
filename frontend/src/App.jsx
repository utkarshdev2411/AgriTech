import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Home, Login, Signup } from "./pages";
import Layout from "./components/Layout/Layout";
import SoilDiagnosis from "./pages/SoilDiagnosis/SoilDiagnosis";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/crop-diagnosis" element={<SoilDiagnosis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;