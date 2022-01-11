import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { useNavigate } from "react-router-dom";

const LoginSuccess = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserAuthData = () => {
      const query = new URLSearchParams(props.location.search);
      const id = query.get("id");
      const accessToken = query.get("accessToken");
      const email = query.get("email");
      const isActive = query.get("isActive");

      if (!id) {
        return;
      }

      const user = {
        userId: id,
        email,
        isActive,
      };

      localStorage.setItem("accessToken", accessToken);
      dispatch(authActions.loggedIn({ accessToken: accessToken }));
      dispatch(userInfoActions.setUser(user));
      setTimeout(() => {
        dispatch(authActions.setUser(user));
        dispatch(userInfoActions.setUser(user));
        navigate("/");
      });
    };
    getUserAuthData();
  });
  return <div>Login Successful</div>;
};

export default LoginSuccess;
