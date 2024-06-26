import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import LoadingWheel from "../LoadingWheel";
import Error from "../Error";

export default function ItemForm({ method }) {
  const { id } = useParams();
  const title = method === "PUT" ? "Update Item" : "Add New Item";
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCatagory] = useState("");
  const [price, setPrice] = useState(0);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [file, setFile] = useState(null);

  const hostname = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  let url;
  switch (method) {
    case "PUT":
      url = `${hostname}/item/${id}/update`;
      break;
    case "POST":
      url = `${hostname}/create_item`;
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await fetch(`${hostname}/categories`);
      const categoriesProcessed = await JSON.parse(await categoriesData.json());
      setCategories(categoriesProcessed);

      if (method === "PUT") {
        const itemData = await fetch(`${hostname}/item/${id}`);
        const itemProcessed = await JSON.parse(await itemData.json());
        setName(itemProcessed.name);
        setDescription(itemProcessed.description);
        setCatagory(itemProcessed.category);
        setPrice(itemProcessed.price);
        setQuantityInStock(itemProcessed.quantityInStock);
      } else {
        setCatagory(categoriesProcessed[0].name);
      }

      setLoading(false);
    };
    try {
      fetchData();
    } catch (e) {
      setError(e);
    }
  }, []);

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();

    let obj = {
      id,
      name,
      description,
      category,
      price: Number(price),
      quantityInStock: Number(quantityInStock),
    };

    if (file) {
      // Upload Image to cloudinary
      const signResponse = await fetch(`${hostname}/api/signuploadform`);
      const signData = await signResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apikey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);

      const cloudinaryUrl =
        "https://api.cloudinary.com/v1_1/" +
        signData.cloudname +
        "/auto/upload";
      let imgURL;
      await fetch(cloudinaryUrl, { method: "POST", body: formData })
        .then((res) => res.text())
        .then((data) => (imgURL = JSON.parse(data).url))
        .catch((e) => console.log(e));

      obj = { ...obj, imgURL };
    }

    // Send the the form data to the database
    let res;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    })
      .then((data) => data.json())
      .then((data) => (res = data))
      .catch((e) => setError(e));

    if (res.completed) {
      navigate("/");
    } else {
      setMessage(res.message);
      setLoading(false);
    }
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div className="formInputContainer">
          <label htmlFor="description">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            id="description"
          />
        </div>
        <div className="formInputContainer">
          <label htmlFor="category">Category</label>
          <select
            value={category}
            onChange={(e) => setCatagory(e.target.value)}
            name="category"
          >
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="formInputContainer">
          <label htmlFor="price">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            name="price"
            id="price"
          />
        </div>
        <div className="formInputContainer">
          <label htmlFor="quantityInStock">Quantity In Stock</label>
          <input
            value={quantityInStock}
            onChange={(e) => setQuantityInStock(e.target.value)}
            type="number"
            name="quantityInStock"
            id="quantityInStock"
          />
        </div>
        <div className="formInputContainer">
          <label htmlFor="img">Item Image</label>
          <input
            onChange={handleFileInputChange}
            name="img"
            type="file"
            required
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

ItemForm.propTypes = {
  method: PropTypes.oneOf(["POST", "PUT"]),
};
