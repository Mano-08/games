import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Cookies from "universal-cookie";
import Layout from "./components/Layout";
import Games from "./pages/Games";
import WhackAPlane from "./pages/WhackAPlane";
import Battleship from "./pages/Battleship";
import { jwtDecode } from "jwt-decode";

function App() {
  return (
    <UserInfoProvider>
      <Router>
        <Layout>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/whack-a-plane" element={<WhackAPlane />} />
            <Route path="/games/battleship" element={<Battleship />} />
          </Routes>
          <Toaster position="bottom-center" reverseOrder={false} />
        </Layout>
      </Router>
    </UserInfoProvider>
  );
}

export const UserInfoContext = React.createContext();

export function UserInfoProvider({ children }) {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      setToken(token);
      const user = jwtDecode(token);
      if (user) {
        setUser(user.userId);
      }
    }
  }, []);
  return (
    <UserInfoContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export default App;
