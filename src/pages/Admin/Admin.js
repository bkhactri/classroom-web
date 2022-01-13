import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ClassBlock from "../../components/ClassBlock/ClassBlock";
import ResponsiveDrawer from "./ResponsiveDrawer"
import AdminAccounts from "./AdminAccounts"
import AdminUsers from "./AdminUsers"



import axiosClassroom from "../../api/classroom.axios";

const Admin = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get("/get-all", {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setClassrooms(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchClassrooms();
  }, [accessToken, navigate]);

  return (
    <>
      <Header loading={isLoading} />
      {!isLoading ? (
        <div>
          <ResponsiveDrawer/>
        </div>
      ) : null}
    </>
  );
};

export default Admin;
