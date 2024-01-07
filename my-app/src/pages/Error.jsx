import '../App.css'
import { useRouteError } from "react-router-dom";

function Error({ errorMessage }) {
  const error = useRouteError();
  if (error) console.error(error);

  return (
    <>
      <div id='homeBody'>
        <h2>Error: {error?.statusText || error?.message || errorMessage}</h2>
        An unexpected error occured
      </div>
    </>
  )
}

export default Error