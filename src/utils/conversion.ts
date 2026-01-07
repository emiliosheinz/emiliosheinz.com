import { isServerSide } from "./runtime";

export function stringToBase64(str: string) {
  return isServerSide()
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}
