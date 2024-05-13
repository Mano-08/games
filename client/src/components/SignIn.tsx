import React, { useState, useEffect } from "react";
import { UserInfoContext } from "../App";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "../types/types";

function SignIn({
  callback,
  success,
}: {
  callback: () => void;
  success: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = React.useContext(UserInfoContext);
  const cookies = new Cookies();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === "username" && setUsername(e.target.value);
    e.target.name === "password" && setPassword(e.target.value);
  };

  const signin = async () => {
    const url = `http://127.0.0.1:5000/api/signin`;
    return await axios.post(url, {
      username,
      password,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (username === "") {
      toast.error("Please enter username");
      return;
    }
    if (password === "") {
      toast.error("Please enter password");
      return;
    }
    if (username.length > 20) {
      toast.error("Username should be less than 20 characters");
      return;
    }
    const usernamePattern = /^[a-zA-Z0-9]*$/;
    if (!usernamePattern.test(username)) {
      toast.error("username cannot contain special characters");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      toast.error("Password should be between 8 and 16 characters");
      return;
    }

    toast.promise(signin(), {
      loading: "Loading...",
      success: (response) => {
        if (response.data && response.data.token) {
          cookies.set("token", response.data.token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          });
          const user = jwtDecode<CustomJwtPayload>(response.data.token);
          setUser(user.userId);
          setToken(response.data.token);
        }
        success();
        return "Login success!";
      },
      error: (error) => {
        if (error.response && error.response.data) {
          if (error.response.data.message === "invaliduser") {
            return "Invalid username!";
          } else if (error.response.data.message === "invalidpassword") {
            return "Invalid password!";
          }
        }
        return "Login failed!";
      },
    });
  };
  return (
    <div className="fixed left-[15vw] top-[10vh] h-[80vh] z-[1200] rounded-xl flex flex-col items-center justify-center bg-white w-[70vw]">
      <h1 className="text-[2rem] my-10">Sign In</h1>
      <form className="flex flex-col gap-2">
        <div className="grid grid-cols-2 items-center">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={username}
            autoComplete="off"
            onChange={handleChange}
            placeholder="thedracula"
            className="border-b border-black outline-none px-0.5 py-1"
          />
        </div>

        <div className="grid grid-cols-2 items-center">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            className="border-b border-black outline-none px-2 py-1"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="my-12 rounded-md text-white px-5 py-1 bg-green-600 hover:bg-green-500"
          >
            Sign In
          </button>
        </div>
      </form>
      <p className="text-neutral-600 text-sm py-6">
        don&apos;t have an account?{" "}
        <button onClick={callback} className="text-blue-500 underline">
          Sign up
        </button>
      </p>
    </div>
  );
}

export default SignIn;
