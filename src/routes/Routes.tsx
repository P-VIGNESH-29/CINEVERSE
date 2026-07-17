import { createBrowserRouter } from "react-router-dom";
// import Login from "../pages/login/Login";
import Layout from "../Componends/Layout/layout/Layout";
import Home from "../pages/Home/Home";
import Showdetails from "../pages/details/Showdetails";
import Elist from "../pages/Elist/Elist";
import Edetails from "../pages/Edetails/Edetails";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/layout",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Home",
        element: <Home />,
      },
      {
        path: "Showdetails/:id?",
        element: <Showdetails />,
      },
      {
        path: "Elist/:showId?/:seasonNumber?",
        element: <Elist />,
      },
      {
        path: "Edetails/:episodeId?",
        element: <Edetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;