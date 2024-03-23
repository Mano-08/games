import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SignIn() {
  const [userEmail, setUserEmail] = useState("");
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const handleChange = (e) => {
    e.target.name === "userEmail" && setUserEmail(e.target.value);
    e.target.name === "userPassword" && setUserPassword(e.target.value);
  };
  useEffect(() => {
    const handleKeyPress = (event) => {
      const capsLockKey =
        event.getModifierState && event.getModifierState("CapsLock");
      setCapsLockOn(capsLockKey);
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <div className="h-screen w-auto flex justify-end">
      <div className="flex flex-col items-center justify-center bg-white w-[70vw]">
        <h1 className="text-[2rem] my-10 unde">Sign In</h1>
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
            <label htmlFor="userPassword">Password: </label>
            <input
              type="password"
              name="userPassword"
              value={userPassword}
              onChange={handleChange}
              className="border-b border-black outline-none px-0.5 py-1"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-12 rounded-md text-white px-5 py-1 bg-green-600 hover:bg-green-500"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-2 py-6">
          {capsLockOn && <p className="text-yellow-600">Caps lock is on!</p>}
          <p className="text-neutral-600 text-sm">
            don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
