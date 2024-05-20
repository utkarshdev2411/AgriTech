import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Home, Login, Signup, CropDiagnosis, SoilDiagnosis,UserProfile,Comment } from "./pages";
import { ToastContainer } from 'react-toastify'
import Layout from "./components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserAPI } from "./store/services/userAction";
import { Navigate } from "react-router-dom";




function App() {
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
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            <Route path="/comment" element={<Comment />} />
            <Route path="/cropdiagnosis" element={<CropDiagnosis />} />
            <Route path="/soildiagnosis" element={<SoilDiagnosis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

{/* <Route path='/profile' element={<ProtectedUser ><UserProfile /></ProtectedUser>} />
<Route path='/login' element={<ProtectedRouting ><Login /></ProtectedRouting>} />
<Route path='/register' element={<ProtectedRouting><Signup /></ProtectedRouting>} />
<Route path="/comment" element={<ProtectedUser><Comment /></ProtectedUser>} />
<Route path="/cropdiagnosis" element={<ProtectedUser><CropDiagnosis /></ProtectedUser>} />
<Route path="/soildiagnosis" element={<ProtectedUser><SoilDiagnosis /></ProtectedUser>} />
</Route> */}


// const ProtectedRouting = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('user'))
//   if (!user) { return children; }
//   else { return <Navigate to={'/'} />; }
// }


// 
// const ProtectedUser = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('user'))
//   if (user) { return children; }
//   else { return <Navigate to={'/login'} />; }
// }

export default App;
