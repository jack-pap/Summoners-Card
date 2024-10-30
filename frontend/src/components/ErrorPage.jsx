"use client";

import "../App.css";
import React from "react";

function ErrorPage({ errorMessage }) {
  return (
    <>
      <div id="homeBody">
        <h1>{`Error ${errorMessage}`}</h1>
      </div>
    </>
  );
}
export default ErrorPage;
