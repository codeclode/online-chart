import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";

export function LoginFirst(prop: { fromRoute: string }) {
  const router = useRouter();
  return (
    <Stack direction="column" alignItems="center">
      <Typography variant="h3" textAlign="center">
        请先登录
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        sx={{ width: "50%" }}
        onClick={() => {
          router.replace(
            `/login?${prop.fromRoute ? "from=" + prop.fromRoute : ""}`
          );
        }}
      >
        登录
      </Button>
    </Stack>
  );
}
