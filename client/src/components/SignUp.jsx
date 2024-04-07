import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserInfoContext } from "../App";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

function SignUp({ callback, success }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(UserInfoContext);
  const cookies = new Cookies();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const usernamePattern = /^[a-zA-Z0-9]*$/;
    switch (name) {
      case "username":
        value.length > 20
          ? toast.error("Username should be less than 20 characters", {
              position: "bottom-left",
            })
          : usernamePattern.test(value)
          ? setUsername(value)
          : toast.error("username cannot contain special characters", {
              position: "bottom-left",
            });
        break;
      case "password":
        value.length > 16
          ? toast.error("Password should be less than 16 characters", {
              position: "bottom-left",
            })
          : setPassword(value);
        break;
      default:
        break;
    }
  };

  const signup = async () => {
    const url = "http://127.0.0.1:5000/api/signup";
    return await axios.post(url, {
      username,
      password,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (username === "") {
      toast.error("Please enter username", {
        position: "bottom-left",
      });
      return;
    }
    if (password === "") {
      toast.error("Please enter password", {
        position: "bottom-left",
      });
      return;
    }
    const usernamePattern = /^[a-zA-Z0-9]*$/;
    if (!usernamePattern.test(username)) {
      toast.error("username cannot contain special characters", {
        position: "bottom-left",
      });
      return;
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long", {
        position: "bottom-left",
      });
      return;
    }

    toast.promise(
      signup(),
      {
        loading: "Registering...",
        success: (response) => {
          success();
          if (response.data && response.data.token) {
            cookies.set("token", response.data.token, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
              path: "/",
            });
            const user = jwtDecode(response.data.token);
            setUser(user.userId);
            setToken(response.data.token);
          }
          return "Registration successful!";
        },
        error: (error) => {
          console.log(error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message === "userexists"
          ) {
            return "Username already exists!";
          }
          return "Registration failed!";
        },
      },
      {
        position: "bottom-left",
      }
    );
  };

  return (
    <div className="fixed left-[15vw] top-[10vh] h-[80vh] z-[1200] rounded-xl flex flex-col items-center justify-center bg-white w-[70vw]">
      <h1 className="text-[2rem] my-10">Sign Up</h1>
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
            onClick={handleRegister}
            className="my-12 rounded-md text-white px-5 py-1 bg-green-600 hover:bg-green-500"
          >
            Create Account
          </button>
        </div>
      </form>
      <p className="text-neutral-600 text-sm py-6">
        already having an account?{" "}
        <button onClick={callback} className="text-blue-500 underline">
          Sign in
        </button>
      </p>
    </div>
  );
}

export default SignUp;
