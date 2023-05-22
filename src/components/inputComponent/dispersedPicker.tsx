import { AddRounded, ClearOutlined, DeleteRounded } from "@mui/icons-material";
import { Badge, Grid, IconButton, Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useState } from "react";

export function DispersedPicker() {
  const [colors, setColors] = useState<string[]>([
    "#66ccff",
    "#139268",
    "#ccff66",
    "#ffcc66",
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  return (
    <Stack alignItems="center">
      <Grid width="90%" mt="5vh" spacing={0} container>
        {colors.map((v, i) => {
          return (
            <Grid
              sx={{
                aspectRatio: "1/1",
                height: "auto",
                backgroundColor: v,
              }}
              className={i === currentIndex ? "dispersedController" : ""}
              xs={1}
              key={v}
              item
              onClick={() => {
                setCurrentIndex(i);
              }}
            ></Grid>
          );
        })}
        <Grid
          sx={{
            aspectRatio: "1/1",
            height: "auto",
            backgroundColor: "transparent",
            boxShadow: "0 0 5px 0 green inset",
          }}
          xs={1}
          item
          onClick={() => {
            console.log("add");
          }}
        >
          <IconButton color="success" sx={{ width: "100%", height: "100%" }}>
            <AddRounded fontSize="large"></AddRounded>
          </IconButton>
        </Grid>
      </Grid>
    </Stack>
  );
}
