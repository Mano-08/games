import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleChange = (e) => {
    e.target.name === "username" && setUsername(e.target.value);
    e.target.name === "password" && setPassword(e.target.value);
  };

  const signin = async () => {
    const url = `http://127.0.0.1:5000/api/signin`;
    await axios.post(url, {
      username,
      password,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    if (username.length > 20) {
      toast.error("Username should be less than 20 characters", {
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

    if (password.length < 8 || password.length > 16) {
      toast.error("Password should be between 8 and 16 characters", {
        position: "bottom-left",
      });
      return;
    }

    toast.promise(
      signin(),
      {
        loading: "Loading...",
        success: () => {
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
      },
      {
        position: "bottom-left",
      }
    );
  };
  return (
    <div className="h-screen w-auto flex justify-end">
      <div className="flex flex-col items-center justify-center bg-white w-[70vw]">
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
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
