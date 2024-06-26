import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error from "./Error";
import ItemList from "./ItemList";
import Item from "./Item";
import Redirect from "./Redirect";
import ItemForm from "./forms/ItemForm";
import CategoryForm from "./forms/CategoryForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <ItemList />,
      },
      {
        path: "/:category",
        element: <ItemList />,
      },
    ],
  },
  {
    path: "/reset",
    element: <Redirect />,
  },
  {
    path: "/category/create",
    element: <CategoryForm method="POST" />,
  },
  {
    path: "/category/:name/update",
    element: <CategoryForm method="PUT" />,
  },
  {
    path: "/item/create",
    element: <ItemForm method="POST" />,
  },
  {
    path: "/item/:id",
    element: <Item />,
  },
  {
    path: "/item/:id/update",
    element: <ItemForm method="PUT" />,
  },
]);

export default router;
