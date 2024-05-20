import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Home, Login, Signup, CropDiagnosis, SoilDiagnosis,UserProfile,Comment } from "./pages";
import { ToastContainer } from 'react-toastify'
import Layout from "./components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserAPI } from "./store/services/userAction";
import { Navigate } from "react-router-dom";
import EditProfile from "./pages/EditProfile/EditProfile";
import AuthLayout from "./components/AuthLayout";




function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCurrentUserAPI())
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path='/profile' element={<AuthLayout authentication={true}><UserProfile /></AuthLayout>} />
            <Route path='/editprofile' element={<AuthLayout authentication={true}><EditProfile /></AuthLayout>} />
            <Route path='/login' element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
            <Route path='/register' element={<AuthLayout authentication={false}><Signup /></AuthLayout>} />
            <Route path="/cropdiagnosis" element={<CropDiagnosis />} />
            <Route path="/soildiagnosis" element={<SoilDiagnosis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
