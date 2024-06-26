import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import LoadingWheel from "../LoadingWheel";
import Error from "../Error";

export default function CategoryForm({ method }) {
  const { name } = useParams();
  const title = method === "PUT" ? "Update Category" : "Add New Category";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [category, setCategory] = useState(name);

  const hostname = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  let url;
  switch (method) {
    case "PUT":
      url = `${hostname}/category/${name}/update`;
      break;
    case "POST":
      url = `${hostname}/create_category`;
      break;
  }

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();

    let obj = {
      oldName: name,
      newName: category,
    };

    // Send the the form data to the database
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.completed) {
          navigate("/");
        } else {
          setMessage(data.message);
          setLoading(false);
        }
      })
      .catch((e) => setError(e));
  };

  if (loading) return <LoadingWheel />;
  if (error) return <Error />;

  return (
    <div className="formContainer" onSubmit={submit}>
      <h2>{title}</h2>
      <form>
        <div className="formInputContainer">
          <label htmlFor="name">Name</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            name="name"
            id="name"
          />
        </div>
        {message && <p className="errorMsg">{message}</p>}
        <div className="formButtonContainer">
          <button className="bigBtn generalBtn submitBtn">Submit</button>
          <button className="bigBtn generalBtn" onClick={() => navigate("..")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

CategoryForm.propTypes = {
  method: PropTypes.oneOf(["POST", "PUT"]),
};
