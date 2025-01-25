import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentAcknowledgement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state.token;
  const userName = location.state.userName;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/dashboard", { state: { token, userName } });
    }
  }, [countdown, navigate]);
  return (
    <div>Transfer Successfull, you will be redirected in {countdown} secs</div>
  );
};
