import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import ListPage from "../pages/ListPage.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/lists/:listId", element: <ListPage /> },
]);