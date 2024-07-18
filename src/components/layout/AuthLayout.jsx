import Box from "@mui/material/Box";
import { Container } from "@mui/system";
import React from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import Logo from "../../assets/images/A5337F77-7446-439C-9D0C-8AF905B87EB8.jpeg";
import authUtils from "../../utils/authUtils";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // JWTを持っているのか確認する。
    const checkAuth = async () => {
      // 認証チェック
      const isAuth = await authUtils.isAuthenticated();
      if (isAuth) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* <img
            src={Logo}
            alt=""
            style={{ width: 262, height: 192, marginBottom: 3 }}
          /> */}
          Oshirase
        </Box>
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthLayout;
