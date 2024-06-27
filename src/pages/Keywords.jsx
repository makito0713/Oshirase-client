import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, List, ListItem, ListItemText, Typography, Button } from '@mui/material';

const Keywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [diffResults, setDiffResults] = useState({ added: [], removed: [] });

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/v1/search-history');
        setKeywords(response.data);
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    };
    fetchKeywords();
  }, []);

  const handleKeywordClick = async (keyword) => {
    setSelectedKeyword(keyword);
    try {
      const response = await axios.get(`http://localhost:5050/api/v1/search-results-diff`, { params: { keyword } });
      setDiffResults(response.data);
    } catch (error) {
      console.error('Error fetching diff results:', error);
    }
  };

  const handleItemClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('URL is invalid:', url);
    }
  };

  const notifyKeyword = async (keyword) => {
    try {
      await axios.post('http://localhost:5050/api/v1/line-notification', { keyword: keyword });
      alert('キーワードの通知が完了しました');
    } catch (error) {
      console.error('通知エラー:', error);
      alert('通知中にエラーが発生しました');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>キーワード一覧</Typography>
      <List>
        {keywords.map((keywordEntry) => (
          <ListItem button key={keywordEntry._id} onClick={() => handleKeywordClick(keywordEntry.keyword)}>
            <ListItemText primary={keywordEntry.keyword} />
            <Button onClick={() => notifyKeyword(keywordEntry.keyword)} variant="outlined" color="primary">
              通知
            </Button>
          </ListItem>
        ))}
      </List>
      {selectedKeyword && (
        <div>
          <Typography variant="h5" gutterBottom>最新の差分履歴: {selectedKeyword}</Typography>
          <Typography variant="h6">追加された項目</Typography>
          <List>
            {diffResults.added.map((item, index) => {
              return (
                <ListItem button key={index} onClick={() => handleItemClick(item.link)}>
                  <ListItemText primary={item.title} secondary={item.link} />
                </ListItem>
              );
            })}
          </List>
          <Typography variant="h6">削除された項目</Typography>
          <List>
            {diffResults.removed.map((item, index) => {
              return (
                <ListItem button key={index} onClick={() => handleItemClick(item.link)}>
                  <ListItemText primary={item.title} secondary={item.link} />
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
    </Container>
  );
};

export default Keywords;
