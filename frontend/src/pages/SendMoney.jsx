import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const SendMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state.token;
  const userId = location.state.userId;
  const firstName = location.state.firstName;
  const lastName = location.state.lastName;
  const userName = location.state.userName;
  const transferUrl = "http://localhost:3000/api/v1/account/transfer";
  const [amount, setAmount] = useState(0);

  const handleAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleInput = () => {
    setAmount("");
  };

  const initiateTransfer = async () => {
    try {
      const response = await axios({
        method: "post",
        url: transferUrl,
        data: { to: userId, amount: amount },
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/acknowledgement", { state: { token, userName } });
    } catch (error) {}
  };

  window.onpopstate = () => {
    navigate("/dashboard", { state: { token, userName } });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      <div className="border shadow-md px-5 pt-8 pb-8">
        <div className="text-2xl font-bold px-20 pb-10">Send Money</div>
        <div className="px-3 grid gap-4">
          <div className="flex gap-2 font-bold text-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 relative top-[-3px] font-normal text-white">
              {firstName.charAt(0).toUpperCase()}
            </span>
            {firstName} {lastName}
          </div>
          <div className="text-xs font-medium">Amount (in Rs)</div>
          <div>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter amount"
              required
              onChange={handleAmount}
              onClick={handleInput}
              value={amount}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-green-600 focus:outline-none font-normal rounded-md text-sm font-medium w-full text-center py-3 hover:bg-green-700"
            onClick={initiateTransfer}
          >
            Initiate Transfer
          </button>
        </div>
      </div>
    </div>
  );
};
