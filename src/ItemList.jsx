import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingWheel from "./LoadingWheel";
import ErrorComponent from "./ErrorComponent";

export default function ItemList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const [items, setItems] = useState([]);

  const url = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  useEffect(() => {
    const fetchData = async () => {
      const itemsData = await fetch(`${url}/items`);
      const itemsProcessed = await JSON.parse(await itemsData.json());
      setItems(itemsProcessed);
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
      {items.map((item) => (
        <div key={item._id} className="card">
          <Link to={`/item/${item._id}`}>
            <img
              className={
                item.quantityInStock == 0 ? "cardImage outOfStock" : "cardImage"
              }
              src={item.imgURL}
              alt={item.name}
            />
          </Link>
          <div className="detailsGrid">
            <span className="name">{item.name}</span>
            <span className="price">${item.price}</span>
            <span className="description">{item.description}</span>
          </div>
          {item.quantityInStock == 0 ? (
            <span className="stockWarningMsg">Out of Stock</span>
          ) : item.quantityInStock < 20 ? (
            <span className="stockWarningMsg">
              Only {item.quantityInStock} Left in Stock
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}
