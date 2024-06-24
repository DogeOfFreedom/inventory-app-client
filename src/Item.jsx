import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingWheel from "./LoadingWheel";
import Error from "./Error";

export default function Item() {
  const { id } = useParams();
  const ref = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  const url = import.meta.env.VITE_HOST_NAME || "http://localhost:3000";
  useEffect(() => {
    const fetchData = async () => {
      const itemData = await fetch(`${url}/item/${id}`);
      const itemProcessed = await JSON.parse(await itemData.json());
      setItem(itemProcessed);
      setLoading(false);
    };

    try {
      fetchData();
    } catch (e) {
      setError(e);
    }
  }, []);

  const showDeleteModal = () => {
    ref.current.showModal();
  };

  const closeModal = () => {
    ref.current.close();
  };

  const deleteItem = async () => {
    try {
      await fetch(`${url}/item/${id}/delete`, { method: "DELETE" });
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <LoadingWheel />;
  if (error) return <Error />;

  return (
    <>
      <div className="itemContainer">
        <div className="itemDetailsContainer">
          <div className="top">
            <h2>{item.name}</h2>
            <span>{item.description}</span>
          </div>
          <div className="textContainer">
            <span>${item.price}</span>
            <span>Quantity In Stock: {item.quantityInStock}</span>
          </div>
          <button onClick={() => navigate("update")} className="generalBtn">
            Update
          </button>
          <button onClick={showDeleteModal} className="deleteBtn">
            Delete
          </button>
        </div>
        <img className="itemImg" src={item.imgURL} alt={item.name} />
        <dialog ref={ref}>
          <div>
            <h2>Delete Item</h2>
            <p>Are you sure you want to delete this item?</p>
            <button className="deleteBtn" onClick={deleteItem}>
              Delete
            </button>
            <button className="generalBtn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </dialog>
      </div>
    </>
  );
}
