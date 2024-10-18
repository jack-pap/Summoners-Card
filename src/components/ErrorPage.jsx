"use client";

import "../App.css";
import React from "react";

const ErrorPage = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode ? `Error ${statusCode}` : "Error"}</h1>
    </div>
  );
};

export default ErrorPage;
