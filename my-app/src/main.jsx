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
    element: <>
      <div className="line" id="leftLine"></div>
      <Layout><App /></Layout>
      <div className="line" id="rightLine"></div>
    </>,
    errorElement: <Layout><Error /></Layout>,
  },
  {
    path: "/player/:server/:summonerName",
    element:
      <div className="dashboard">
        <Layout><Dashboard /></Layout>
      </div>,
    errorElement: <Layout><Error /></Layout>,
  },
  {
    path: "/champions",
    element: <Layout><Champions /></Layout>,
    errorElement: <Layout><Error /></Layout>,
  },
  {
    path: "/about",
    element: <Layout><About /></Layout>,
    errorElement: <Layout><Error /></Layout>,
  },
]);

const container = document.getElementById('root');

if (!container._reactRootContainer) {
  // Create the root only once
  const root = ReactDOM.createRoot(container);
  root.render(<RouterProvider router={router} />);
} else {
  // If root is already created update the existing root
  const root = container._reactRootContainer._internalRoot;
  root.render(<RouterProvider router={router} />);
}

