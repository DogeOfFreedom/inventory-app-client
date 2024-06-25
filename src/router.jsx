import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error from "./Error";
import ItemList from "./ItemList";
import Item from "./Item";
import Redirect from "./Redirect";
import ItemForm from "./forms/ItemForm";

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
    path: "/item/:id",
    element: <Item />,
  },
  {
    path: "/item/:id/update",
    element: <ItemForm method="PUT" />,
  },
]);

export default router;
