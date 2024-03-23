import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [userEmail, setUserEmail] = useState("");
  const [confirmUserEmail, setConfirmUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "userEmail":
        setUserEmail(value);
        break;
      case "userPassword":
        setUserPassword(value);
        break;
      case "confirmUserEmail":
        setConfirmUserEmail(value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const url = "http://localhost:5000/api/register";
      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, userPassword }),
      });
      if (response.error) {
        console.error(response.error);
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="h-screen w-auto flex justify-end">
      <div className="flex flex-col items-center justify-center bg-white w-[70vw]">
        <h1 className="text-[2rem] my-10">Sign Up</h1>
        <form className="flex flex-col gap-2">
          <div className="grid grid-cols-2 items-center">
            <label htmlFor="userEmail">Email: </label>
            <input
              type="text"
              name="userEmail"
              value={userEmail}
              onChange={handleChange}
              placeholder="example@outlook.com"
              className="border-b border-black outline-none px-0.5 py-1"
            />
          </div>
          <div className="grid grid-cols-2 items-center">
            <label htmlFor="confirmUserEmail">Confirm User Email: </label>
            <input
              type="text"
              name="confirmUserEmail"
              value={confirmUserEmail}
              onChange={handleChange}
              placeholder="example@outlook.com"
              required
              className="border-b border-black outline-none px-0.5 py-1"
            />
          </div>
          <div className="grid grid-cols-2 items-center">
            <label htmlFor="userPassword">Password: </label>
            <input
              type="password"
              name="userPassword"
              value={userPassword}
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
          <Link to="/signin" className="text-blue-500 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
