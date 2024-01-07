import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import App from './pages/App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Champions from './pages/Champions.jsx';
import Privacy from './pages/About.jsx';
import Error from './pages/Error.jsx';
import './index.css'
import './app.css'
import About from './pages/About.jsx';

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><App /></Layout>,
    errorElement: <Layout><Error /></Layout>,
  },
  {
    path: "/player/:server/:summonerName",
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: "/champions",
    element: <Layout><Champions /></Layout>,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

