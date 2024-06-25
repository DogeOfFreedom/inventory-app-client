import { Navigate } from "react-router-dom";

export default function Redirect() {
  console.log("redirect");
  return <Navigate to={"/"} />;
}
