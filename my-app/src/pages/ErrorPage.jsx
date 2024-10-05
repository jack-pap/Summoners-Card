/* eslint-disable react/prop-types */
import "../App.css";
import { useRouteError } from "react-router-dom";

function ErrorPage({ errorMessage }) {
  const error = useRouteError();
  if (error) console.error(error);

  return (
    <>
      <div id="homeBody">
        <h1>Error: {( error?.status + " " + error?.statusText) || error?.message || errorMessage}</h1>
      </div>
    </>
  );
}

export default ErrorPage;
