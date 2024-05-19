import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Home, Login, Signup, CropDiagnosis } from "./pages";
import { ToastContainer } from "react-toastify";
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
            <Route path="/userprofile" element={<UserProfile user={user}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
