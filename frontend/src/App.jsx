import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Diagnose from "./Pages/Diagnose";
import Chatroom from "./Pages/Chatroom";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={< Diagnose />} />
          <Route path="/hackathons" element={<Chatroom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;