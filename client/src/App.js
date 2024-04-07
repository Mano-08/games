import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Layout from "./components/Layout";
import Games from "./pages/Games";
import WhackAPlane from "./pages/WhackAPlane";
import Battleship from "./pages/Battleship";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/whack-a-plane" element={<WhackAPlane />} />
          <Route path="/games/battleship" element={<Battleship />} />
        </Routes>
        <Toaster position="bottom-center" reverseOrder={false} />
      </Layout>
    </Router>
  );
}

export default App;
