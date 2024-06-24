import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Error from "./Error";
import ItemList from "./ItemList";
import Item from "./Item";

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
    path: "/item/:id",
    element: <Item />,
  },
]);

export default router;
