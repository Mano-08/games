import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Cookies from "universal-cookie";
import Layout from "./components/Layout";
import Games from "./pages/Games";
import WhackAPlane from "./pages/WhackAPlane";
import Battleship from "./pages/Battleship";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./types/types";

function App() {
  return (
    <UserInfoProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
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

export const UserInfoContext = React.createContext({
  setUser: (user: any) => {},
  token: "",
  user: "",
  setToken: (token: any) => {},
  logout: () => {},
});

export function UserInfoProvider({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [token, setToken] = React.useState<string>("");
  const [user, setUser] = React.useState<string>("");
  React.useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      setToken(token);
      const user = jwtDecode<CustomJwtPayload>(token);
      if (user) {
        setUser(user.userId);
      }
    }
  }, []);

  const logout = () => {
    const cookies = new Cookies();
    if (cookies.get("token")) {
      cookies.remove("token");
      setToken("");
      setUser("");
    }
  };

  return (
    <UserInfoContext.Provider
      value={{ user, setUser, token, setToken, logout }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}

export default App;
