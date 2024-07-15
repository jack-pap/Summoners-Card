/* eslint-disable react/prop-types */
import "../App.css";
import { useRouteError } from "react-router-dom";

function ErrorPage({ errorMessage }) {
  const error = useRouteError();
  if (error) console.error(error);

  return (
    <>
      <div id="homeBody">
        <h2>Error: {error?.statusText || error?.message || errorMessage}</h2>
      </div>
    </>
  );
}

export default ErrorPage;
