import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Home, Login, Signup, CropDiagnosis, SoilDiagnosis,UserProfile } from "./pages";
import { ToastContainer } from 'react-toastify'
import Layout from "./components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserAPI } from "./store/services/userAction";
import { Navigate } from "react-router-dom";


function App() {
  const data = useSelector(state => state.user.userInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCurrentUserAPI())
  }, []);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path='/profile' element={<ProtectedUser user={data} ><UserProfile /></ProtectedUser>} />
            <Route path='/login' element={<ProtectedRouting user={data} ><Login /></ProtectedRouting>} />
            <Route path='/register' element={<ProtectedRouting><Signup /></ProtectedRouting>} />
            <Route path="/cropdiagnosis" element={<ProtectedUser><CropDiagnosis /></ProtectedUser>} />
            <Route path="/soildiagnosis" element={<ProtectedUser><SoilDiagnosis /></ProtectedUser>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}



const ProtectedRouting = ({ user,children }) => {
  if (!user) { return children; }
  else { return <Navigate to={'/'} />; }
}


// 
const ProtectedUser = ({user, children }) => {
  if (user) { return children; }
  else { return <Navigate to={'/login'} />; }
}

export default App;
