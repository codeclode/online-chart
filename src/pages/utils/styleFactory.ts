import { SxProps, Theme } from "@mui/material";

export const textOver = function (clamp = 2): SxProps<Theme> {
  if (clamp === 1) {
    return {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      wordBreak: "break-all",
      wordWrap: "break-word",
    };
  }
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" /* 表示盒子对象的子元素的排列方式 */,
    textOverflow: "ellipsis",
    wordBreak: "break-all",
    wordWrap: "break-word",
    whiteSpace: "wrap",
    overflow: "hidden",
    lineClamp: clamp,
    WebkitLineClamp: clamp,
  };
};
