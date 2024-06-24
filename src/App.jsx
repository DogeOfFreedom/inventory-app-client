import { useState, useEffect } from "react";
import "./App.css";
import LoadingWheel from "./LoadingWheel";
import ErrorComponent from "./ErrorComponent";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ItemList from "./ItemList";

function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await fetch(`${url}/categories`);
      const categoriesProcessed = await JSON.parse(await categoriesData.json());
      setCategories(categoriesProcessed);
      setLoading(false);
    };
    try {
      fetchData();
    } catch (e) {
      setError(e);
    }
  }, []);

  if (loading) return <LoadingWheel />;
  if (error) return <ErrorComponent />;

  return (
    <>
      <header>
        <span>Greg's Goods</span>
      </header>
      <nav>
        {categories.map((category) => (
          <Link to={`/${category.name}`} key={category._id}>
            <div className="navItem">{category.name}</div>
          </Link>
        ))}
        <div className="btnContainer">
          <button className="navBtn">+ Add Category</button>
          <button className="navBtn">+ Add Item</button>
        </div>
      </nav>
      <div className="contentContainer">
        <Outlet />
      </div>
    </>
  );
}

export default App;
