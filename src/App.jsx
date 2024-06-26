import { useState, useEffect, useRef } from "react";
import "./App.css";
import LoadingWheel from "./LoadingWheel";
import ErrorComponent from "./ErrorComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();
  const ref = useRef();

  const [canDelete, setCanDelete] = useState(false);

  const url = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await fetch(`${url}/categories`);
      const categoriesProcessed = await JSON.parse(await categoriesData.json());
      setCategories(categoriesProcessed);
      console.log(categoriesProcessed);
      setLoading(false);
    };

    try {
      fetchData();
    } catch (e) {
      setError(e);
    }
  }, []);

  const resetShop = async () => {
    await fetch(`${url}/populate_db`, { method: "POST" });
    console.log("reset shop");
    navigate("/reset");
  };

  const capitalize = (string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  };

  const openDeleteCategoryModal = async () => {
    await fetch(`${url}/category/${category}/delete_confirmation`)
      .then((data) => data.json())
      .then((data) => {
        setCanDelete(data.canDelete);
        ref.current.showModal();
      });
  };

  const deleteCategory = async () => {
    await fetch(`${url}/category/${category}/delete`, { method: "DELETE" });
    navigate("/reset");
    ref.current.close();
  };

  const closeModal = async () => {
    ref.current.close();
  };

  if (loading) return <LoadingWheel />;
  if (error) return <ErrorComponent />;

  return (
    <>
      <header>
        <span>Greg&apos;s Goods</span>
      </header>
      <nav>
        <Link to="/" key="all">
          <div className="navItem">All</div>
        </Link>
        {categories.map((item) => (
          <Link to={`/${item.name}`} key={item._id}>
            <div
              className={
                category === item.name ? "navItem selectedNavItem" : "navItem"
              }
            >
              {capitalize(item.name)}
            </div>
          </Link>
        ))}
        <div className="btnContainer">
          <button onClick={() => navigate("/item/create")} className="navBtn">
            + Add Item
          </button>
          <button
            onClick={() => navigate("/category/create")}
            className="navBtn"
          >
            + Add Category
          </button>
          {category && (
            <>
              <button
                onClick={() => navigate(`/category/${category}/update`)}
                className="navBtn"
              >
                + Update Category
              </button>
              <button onClick={openDeleteCategoryModal} className="navBtn">
                - Delete Category
              </button>
            </>
          )}
        </div>
        <button onClick={resetShop} className="navBtn resetBtn">
          Reset Shop to Default
        </button>
      </nav>
      <div className="contentContainer">
        <Outlet />
      </div>
      <dialog ref={ref}>
        <div>
          {canDelete ? (
            <>
              <h2>Delete Category</h2>
              <p>Are you sure you want to delete this category?</p>
              <button className="bigBtn deleteBtn" onClick={deleteCategory}>
                Delete
              </button>
              <button className="bigBtn generalBtn" onClick={closeModal}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2>Error</h2>
              <p>
                Delete all items in this category before deleting this category
              </p>
              <button className="bigBtn generalBtn" onClick={closeModal}>
                Cancel
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

export default App;
