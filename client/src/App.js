import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import WhackAMole from "./pages/WhackAMole";
import Layout from "./components/Layout";
import Games from "./pages/Games";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/whack-a-mole" element={<WhackAMole />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
