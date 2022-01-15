import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import ResponsiveDrawer from "./ResponsiveDrawer"



const Admin = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!accessToken) {
      navigate("/login");
    }
    setIsLoading(false);
  }, [accessToken, navigate]);

  return (
    <>
      <Header loading={isLoading}/>
      {!isLoading ? (
        <div>
          <ResponsiveDrawer/>
        </div>
      ) : null}
    </>
  );
};

export default Admin;
