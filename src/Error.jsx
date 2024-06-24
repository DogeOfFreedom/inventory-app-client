import { Link } from "react-router-dom";
import error from "./error.module.css";

export default function Error() {
  return (
    <div className={error.container}>
      <h1>Uh oh, 404 Error :-(</h1>
      <Link to="/">Back Home</Link>
    </div>
  );
}
