import '../App.css'
import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div id='homeBody'>
        <h1>Error: {error.statusText || error.message}</h1>
        An unexpected error occured
      </div>
    </>
  )
}

export default Error