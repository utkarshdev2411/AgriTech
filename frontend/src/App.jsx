import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { Home, Login, Signup,CropDiagnosis,SoilDiagnosis } from "./pages";
import {ToastContainer } from 'react-toastify'
import Layout from "./components/Layout/Layout";
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
    <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path='/profile' element={<ProtectedUser><UserProfile /></ProtectedUser>} /> */}
            <Route path='/login' element={<ProtectedRouting><Login /></ProtectedRouting>} />
            <Route path='/register' element={<ProtectedRouting><Signup /></ProtectedRouting>} />
            <Route path="/cropdiagnosis" element={<ProtectedUser><CropDiagnosis /></ProtectedUser>} />
            <Route path="/soildiagnosis" element={<ProtectedUser><SoilDiagnosis /></ProtectedUser>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}



const ProtectedRouting = ({ children }) => {
  // const user = JSON.parse(localStorage.getItem('user'))
  
  if (!user) { return children; }
  else { return <Navigate to={'/'} />; }
}


// 
const ProtectedUser = ({ children }) => {
  // const user = JSON.parse(localStorage.getItem('user'));
  // const user=false;
  if (user) { return children; }
  else { return <Navigate to={'/login'} />; }
}

export default App;
