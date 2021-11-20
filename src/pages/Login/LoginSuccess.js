import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../stores/authenticationStore";
import { useHistory } from "react-router-dom";



const LoginSuccess = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserAuthData = () => {
      const query = new URLSearchParams(props.location.search);
      const id = query.get('id');
      const accessToken = query.get('accessToken');

      if (!id){
          return;
      }

      // console.log('user', id, accessToken);
      const user = {
          id: id,
          accessToken: accessToken,
      };
      localStorage.setItem("accessToken", accessToken);
      dispatch(authActions.setUser(user));
      setTimeout(() => {
          dispatch(authActions.setUser(user));
          history.replace("/");
        });
    };
    getUserAuthData();
  });    
  return <div>Login Successful</div>;
}

export default LoginSuccess;
