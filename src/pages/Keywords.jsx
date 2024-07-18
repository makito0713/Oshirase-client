import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

const Keywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [diffResults, setDiffResults] = useState({ added: [], removed: [] });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // 初期状態はオン
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get(
          "https://protean-unity-423404-t2.an.r.appspot.com/api/v1/search-history"
        );
        setKeywords(response.data);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setSnackbarMessage("キーワードの取得に失敗しました");
        setOpenSnackbar(true);
      }
    };
    fetchKeywords();
  }, []);

  const handleKeywordClick = async (keyword) => {
    setSelectedKeyword(keyword);
    try {
      const response = await axios.get(
        `https://protean-unity-423404-t2.an.r.appspot.com/api/v1/search-results-diff`,
        { params: { keyword } }
      );
      setDiffResults(response.data);
    } catch (error) {
      console.error("Error fetching diff results:", error);
      setSnackbarMessage("差分データの取得に失敗しました");
      setOpenSnackbar(true);
    }
  };

  const handleItemClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("URL is invalid:", url);
    }
  };

  const notifyKeyword = async (keyword) => {
    if (!notificationsEnabled) {
      setSnackbarMessage("通知が無効になっています");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post(
        "https://protean-unity-423404-t2.an.r.appspot.com/api/v1/line-notification",
        { keyword }
      );
      setSnackbarMessage("キーワードの通知が完了しました");
    } catch (error) {
      console.error("通知エラー:", error);
      setSnackbarMessage("通知中にエラーが発生しました");
    }
    setOpenSnackbar(true);
  };

  const handleToggleChange = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setSnackbarMessage(
      notificationsEnabled ? "通知が無効になりました" : "通知が有効になりました"
    );
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        キーワード一覧
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={handleToggleChange}
          />
        }
        label="通知を有効にする"
      />
      <List>
        {keywords.map((keywordEntry) => (
          <ListItem
            button
            key={keywordEntry._id}
            onClick={() => handleKeywordClick(keywordEntry.keyword)}
          >
            <ListItemText primary={keywordEntry.keyword} />
            <Button
              onClick={() => notifyKeyword(keywordEntry.keyword)}
              variant="outlined"
              color="primary"
            >
              通知
            </Button>
          </ListItem>
        ))}
      </List>
      {selectedKeyword && (
        <div>
          <Typography variant="h5" gutterBottom>
            最新の差分履歴: {selectedKeyword}
          </Typography>
          <Typography variant="h6">追加された項目</Typography>
          <List>
            {diffResults.added.map((item) => (
              <ListItem
                button
                key={item.link}
                onClick={() => handleItemClick(item.link)}
              >
                <ListItemText primary={item.title} secondary={item.link} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">削除された項目</Typography>
          <List>
            {diffResults.removed.map((item) => (
              <ListItem
                button
                key={item.link}
                onClick={() => handleItemClick(item.link)}
              >
                <ListItemText primary={item.title} secondary={item.link} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notificationsEnabled ? "success" : "warning"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Keywords;
