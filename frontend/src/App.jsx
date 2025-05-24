import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Home, Login, Signup, CropDiagnosis, SoilDiagnosis,UserProfile,Community } from "./pages";
import { ToastContainer } from 'react-toastify'
import Layout from "./components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserAPI } from "./store/services/userAction";
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
            <Route path='/community' element={<AuthLayout authentication={true}><Community /></AuthLayout>} />
            <Route path='/editprofile' element={<AuthLayout authentication={true}><EditProfile /></AuthLayout>} />
            <Route path='/login' element={<AuthLayout authentication={false}><Login /></AuthLayout>} />
            <Route path='/register' element={<AuthLayout authentication={false}><Signup /></AuthLayout>} />
            <Route path="/cropdiagnosis" element={<AuthLayout authentication={true}><CropDiagnosis /></AuthLayout>} />
            <Route path="/soildiagnosis" element={<AuthLayout authentication={true}><SoilDiagnosis /></AuthLayout>} />

          </Route>
       
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
