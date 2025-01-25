import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInFailed, setSignInFailed] = useState(false);
  const navigate = useNavigate();

  const handleEmail = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleSignIn = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/v1/user/signin",
        data: {
          username: email,
          password: password,
        },
      });
      setPassword("");
      setEmail("");
      setSignInFailed(false);
      console.log(response.data);
      const token = response.data.token;
      const userName = response.data.username;
      navigate("/dashboard", { state: { token, userName } });
    } catch (error) {
      console.error(error.response.data.message);
      setSignInFailed(true);
      setEmail("");
      setPassword("");
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-400 ">
      <div className="flex flex-col bg-white rounded-lg py-5">
        <div className="grid justify-items-center">
          <div className="text-2xl font-bold pb-1">Sign In</div>
          <div className="px-12 py-0.5 text-sm text-zinc-400 font-medium">
            Enter your credentials to access your
          </div>
          <div className="px-10 text-sm text-zinc-400 font-medium">account</div>
        </div>
        <div className="pt-5 px-5 grid gap-4">
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
            onClick={handleSignIn}
          >
            Sign In
          </button>
          {signInFailed && (
            <div className="block text-sm font-medium text-red-500 text-center">
              Wrong email or password
            </div>
          )}
          <div className="block text-sm font-medium text-gray-900 text-center">
            Don't have an account?{" "}
            <span
              className="underline decoration-1 hover:cursor-pointer"
              onClick={goToSignUp}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
