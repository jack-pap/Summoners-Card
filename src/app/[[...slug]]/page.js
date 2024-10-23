import React from "react";
import { notFound } from "next/navigation";
import "../../App.css";
import "../../index.css";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page({ params }) {
  const { slug } = params;

  // Check if the slug is valid for root
  if (slug != undefined) {
    return notFound(); 
  }

  return (
    <>
      <ClientOnly />
    </>
  );
}
