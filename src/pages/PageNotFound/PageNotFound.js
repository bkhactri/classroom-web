import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import NotFound from "../../assets/404.png";
const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={NotFound}
          style={{ width: "100%", height: "100%", marginBottom: 50 }}
          alt=""
        />
        <Link
          to="/"
          style={{ textDecoration: "none", fontSize: 20, fontWeight: "bold" }}
        >
          {t("goHome")}
        </Link>
      </Container>
    </Fragment>
  );
};

export default PageNotFound;
