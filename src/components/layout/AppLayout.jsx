import Box from "@mui/material/Box";
import React from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import Sidebar from "../common/Sidebar";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import Button from "@mui/material/Button"; // 新しく追加

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // JWTを持っているのか確認する。
    const checkAuth = async () => {
      // 認証チェック
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate("/login");
      } else {
        // ユーザーを保存する
        dispatch(setUser(user));
      }
    };
    checkAuth();
  }, [navigate,dispatch]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 1, width: "max-content " }}>
          <Outlet />
        </Box>
      </Box>
      {/* 新しく追加したキーワード一覧へのリンク */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/keywords")} // キーワード一覧へのリンク
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        キーワード一覧
      </Button>
    </div>
  );
};

export default AppLayout;
