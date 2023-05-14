export type Message = {
  message: string;
  open: boolean;
  type: "success" | "error" | "warning" | "info";
};
