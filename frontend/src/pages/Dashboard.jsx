import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const serverUrl = "http://localhost:3000/api/v1/user/bulk";
  const balanceUrl = "http://localhost:3000/api/v1/account/balance";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [balance, setBalance] = useState(NaN);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location?.state?.token;
  const userName = location?.state?.userName;

  useEffect(() => {
    async function getData() {
      const response = await axios({
        method: "get",
        url: serverUrl,
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    }
    async function getBalance() {
      const response = await axios({
        method: "get",
        url: balanceUrl,
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(response.data.balance);
    }
    const handlePopState = () => {
      if (!token) {
        navigate("/signin");
        console.log("Not authorised");
      }
    };
    handlePopState();
    getData();
    getBalance();
  }, []);

  const goToSendMoney = (userId, firstName, lastName) => {
    navigate("/send", {
      state: { token, userId, firstName, lastName, userName },
    });
  };

  const renderUsers = () => {
    let count = 1;
    {
      return users.map((user) => (
        <div className="grid grid-cols-2 gap-2" key={user._id}>
          <div className="flex gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 relative top-[-3px]">
              U{count++}
            </span>
            {user.firstName} {user.lastName}
          </div>
          <div className="justify-self-end">
            <button
              type="submit"
              className="text-white bg-neutral-950 focus:outline-none font-medium rounded-lg text-sm font-medium text-center  hover:bg-neutral-800 p-2"
              onClick={() =>
                goToSendMoney(user._id, user.firstName, user.lastName)
              }
            >
              Send Money
            </button>
          </div>
        </div>
      ));
    }
  };

  const handleSearch = async (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
    const response = await axios({
      method: "get",
      url: serverUrl + "?filter=" + searchValue,
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(response.data.users);
  };

  return (
    <div>
      <div className="grid grid-cols-2 justify-between p-4 border-b">
        <div className="text-xl font-bold">Payments App</div>
        <div className="flex justify-self-end font-medium gap-4">
          Hello, {userName}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 relative top-[-3px]">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="grid gap-3 px-4 pt-4 text-xl font-bold">
        <div>Your Balance {balance}</div>
        <div>Users</div>
      </div>
      <div className="px-4 pt-5">
        <div className="flex">
          <form className="w-full">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only "
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                placeholder="Search users..."
                required
                onChange={handleSearch}
                value={search}
              />
            </div>
          </form>
        </div>
        <div className="grid gap-4 pt-8">{renderUsers()}</div>
      </div>
    </div>
  );
};
