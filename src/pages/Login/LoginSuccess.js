import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserAuthData = () => {
      const id = searchParams.get("id");
      const accessToken = searchParams.get("accessToken");
      const email = searchParams.get("email");
      const isActive = searchParams.get("isActive");
      const avatarUrl = searchParams.get("avatarURL");

      if (!id) {
        return;
      }

      const userInfo = {
        userId: id,
        email: email,
        isActive: isActive,
        avatarUrl: avatarUrl,
      };
      localStorage.setItem("c_user", email);
      localStorage.setItem("accessToken", accessToken);
      setTimeout(() => {
        dispatch(authActions.loggedIn({ accessToken: accessToken }));
        dispatch(userInfoActions.setUser(userInfo));
        navigate("/");
      }, 50);
    };
    getUserAuthData();
  });
  return <div>Login Successful</div>;
};

export default LoginSuccess;
