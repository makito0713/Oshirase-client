import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const SearchComponent = ({ token, userId }) => {
  // tokenとuserIdをプロップスとして受け取る
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [diffResults, setDiffResults] = useState({ added: [], removed: [] });
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const searchKeyword = async (event) => {
    event.preventDefault();

    if (!keyword) {
      alert("キーワードを入力してください");
      return;
    }

    try {
      const response = await axios.get(
        `https://protean-unity-423404-t2.an.r.appspot.com/api/v1/search`,
        {
          params: { keyword: keyword },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(response.data.items || []);
      setShowResults(true);
      setShowHistory(false);
      setShowDiff(false);
    } catch (error) {
      console.error("検索中にエラーが発生しました:", error.message);
      alert("検索中にエラーが発生しました");
    }
  };

  const saveKeyword = async () => {
    try {
      if (!keyword) {
        alert("キーワードを入力してください");
        return;
      }
      await axios.post(
        "https://protean-unity-423404-t2.an.r.appspot.com/api/v1/keywords",
        { keyword, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("キーワードが正常に保存されました");
      fetchSearchHistory();
    } catch (error) {
      console.error("キーワード保存中にエラーが発生しました:", error.message);
      alert("キーワードの保存中にエラーが発生しました");
    }
  };

  const fetchSearchHistory = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://protean-unity-423404-t2.an.r.appspot.com/api/v1/search-history",
        {
          params: { user: userId }, // user フィールドを追加
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchHistory(response.data);
      setShowHistory(true);
      setShowResults(false);
      setShowDiff(false);
    } catch (error) {
      console.error("検索履歴の取得中にエラーが発生しました:", error.message);
      alert("検索履歴の取得中にエラーが発生しました");
    }
  }, [token, userId]);

  const fetchDiffResults = async () => {
    try {
      const response = await axios.get(
        "https://protean-unity-423404-t2.an.r.appspot.com/api/v1/search-results-diff",
        {
          params: { keyword: keyword, user: userId }, // user フィールドを追加
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiffResults(response.data);
      setShowDiff(true);
      setShowResults(false);
      setShowHistory(false);
    } catch (error) {
      console.error("差分結果の取得中にエラーが発生しました:", error.message);
      alert("差分結果の取得中にエラーが発生しました");
    }
  };

  const deleteKeyword = async (id) => {
    try {
      await axios.delete(
        `https://protean-unity-423404-t2.an.r.appspot.com/api/v1/keywords/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("キーワードが正常に削除されました");
      fetchSearchHistory();
    } catch (error) {
      console.error("キーワード削除中にエラーが発生しました:", error.message);
      alert("キーワードの削除中にエラーが発生しました");
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, [fetchSearchHistory]);

  return (
    <Box sx={{ padding: "20px" }}>
      <form onSubmit={searchKeyword}>
        <TextField
          id="search_keyword_input"
          name="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワードを入力"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
        <Button type="submit" variant="contained" color="primary">
          検索
        </Button>
        <Button
          onClick={saveKeyword}
          variant="contained"
          color="secondary"
          sx={{ marginLeft: "10px" }}
        >
          キーワードを保存
        </Button>
        <Button
          onClick={fetchSearchHistory}
          variant="contained"
          sx={{ marginLeft: "10px" }}
        >
          検索履歴を表示
        </Button>
        <Button
          onClick={fetchDiffResults}
          variant="contained"
          sx={{ marginLeft: "10px" }}
        >
          差分結果を表示
        </Button>
      </form>

      {showResults && results.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">検索結果</Typography>
          <List>
            {results.map((item) => (
              <ListItem key={item.link} alignItems="flex-start">
                <ListItemText
                  primary={
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  }
                  secondary={item.snippet}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {showHistory && searchHistory.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">検索履歴</Typography>
          <List>
            {searchHistory.map((item) => (
              <ListItem key={item._id} alignItems="flex-start">
                <ListItemText
                  primary={item.keyword}
                  secondary={new Date(item.createdAt).toLocaleString()}
                />
                <IconButton onClick={() => deleteKeyword(item._id)}>
                  <DeleteOutlinedIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {showDiff &&
        (diffResults.added.length > 0 || diffResults.removed.length > 0) && (
          <Box sx={{ marginTop: "20px" }}>
            {diffResults.added.length > 0 && (
              <Box>
                <Typography variant="h6">追加された結果</Typography>
                <List>
                  {diffResults.added.map((item) => (
                    <ListItem key={item.link} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        }
                        secondary={item.snippet}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {diffResults.removed.length > 0 && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6">過去に追加された結果</Typography>
                <List>
                  {diffResults.removed.map((item) => (
                    <ListItem key={item.link} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        }
                        secondary={item.snippet}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
    </Box>
  );
};

export default SearchComponent;
