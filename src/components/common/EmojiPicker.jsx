import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Picker from "@emoji-mart/react";

const EmojiPicker = (props) => {
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [isShowPicker, setIsShowPicker] = useState(false);

  useEffect(() => {
    setSelectedEmoji(props.icon);
  }, [props.icon]);

  const showPicker = () => setIsShowPicker(!isShowPicker);

  const selectEmoji = (e) => {
    // console.log(e);
    const emojiCode = e.unified.split("-");
    console.log(emojiCode);
    let codesArray = [];
    emojiCode.forEach((el) => codesArray.push("0x" + el));
    // console.log(codesArray);
    const emoji = String.fromCodePoint(...codesArray);
    console.log(emoji);
    setIsShowPicker(false);
    props.onChange(emoji);
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{ cursor: "pointer" }}
        onClick={showPicker}
      >
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPicker ? "block" : "none",
          position: "absolute",
          top: "100%", // 絵文字ピッカーをボタンの下に表示
          left: "0", // 必要に応じて調整
          zIndex: "1000",
        }}
      >
        <Picker onEmojiSelect={selectEmoji} />
      </Box>
    </Box>
  );
};

export default EmojiPicker;
