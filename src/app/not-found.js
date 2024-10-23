"use client";

import "../App.css";
import React from "react";

function ErrorPage({ errorMessage }) {
  return (
    <div id="homeBody">
      <h1>{`Error ${errorMessage || "404 not found"}`}</h1>
    </div>
  );
}
export default ErrorPage;
