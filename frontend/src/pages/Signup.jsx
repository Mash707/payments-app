import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpFailed, setSignUpFailed] = useState(false);
  const navigate = useNavigate();

  const handleFirstName = (event) => {
    const value = event.target.value;
    setFirstName(value);
  };

  const handleLastName = (event) => {
    const value = event.target.value;
    setLastName(value);
  };

  const handleEmail = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleSignUp = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/user/signup",
        data: {
          firstName: firstName,
          lastName: lastName,
          username: email,
          password: password,
        },
      });
      setFirstName("");
      setLastName("");
      setPassword("");
      setEmail("");
      setSignUpFailed(false);
      const token = response.data.token;
      const userName = firstName;
      navigate("/dashboard", { state: { token, userName } });
    } catch (error) {
      console.error(error.response.data.message);
      setSignUpFailed(true);
      setEmail("");
      setPassword("");
    }
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-400 ">
      <div className="flex flex-col bg-white rounded-lg py-5">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold">Sign Up</div>
          <div className="px-12 py-0.5 text-sm text-zinc-400 font-medium">
            Enter your information to create an
          </div>
          <div className="px-10 text-sm text-zinc-400 font-medium">account</div>
        </div>
        <div className="pt-5 px-5 grid gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              First name
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John"
              required
              onChange={handleFirstName}
              value={firstName}
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Last name
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Doe  "
              required
              onChange={handleLastName}
              value={lastName}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="johndoe@email.com"
              required
              onChange={handleEmail}
              value={email}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder=""
              required
              onChange={handlePassword}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-neutral-950 focus:outline-none font-medium rounded-lg text-sm font-medium w-full text-center py-3 hover:bg-neutral-800"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          {signUpFailed && (
            <div className="block text-sm font-medium text-red-500 text-center">
              Email already taken / Incorrect inputs
            </div>
          )}
          <div className="block text-sm font-medium text-gray-900 text-center">
            Already have an account?{" "}
            <span
              className="underline decoration-1 hover:cursor-pointer"
              onClick={goToSignIn}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
