import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Home, Login, Signup, CropDiagnosis } from "./pages";
import { ToastContainer } from "react-toastify";
=======
import React from "react";
import { Home, Login, Signup,CropDiagnosis,SoilDiagnosis } from "./pages";
import {ToastContainer } from 'react-toastify'
>>>>>>> 551f560708515e5e7cd41aeb52676d4007d54f2c
import Layout from "./components/Layout/Layout";
import UserProfile from "./pages/UserProfile/UserProfile";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getCurrentUserAPI } from "./store/services/userAction";

function App() {
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCurrentUserAPI())
  }, []);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/cropdiagnosis" element={<CropDiagnosis />} />
<<<<<<< HEAD
            <Route path="/userprofile" element={<UserProfile user={user}/>} />
=======
            <Route path="/soildiagnosis" element={<SoilDiagnosis />} />
>>>>>>> 551f560708515e5e7cd41aeb52676d4007d54f2c
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
