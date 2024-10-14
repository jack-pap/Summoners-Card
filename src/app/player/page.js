import React from "react";
import Dashboard from "../../../../components/Dashboard";

export default function PlayerPage({ params }) {
  return (
    <div className="dashboard">
      <Dashboard server={params.server} summonerName={params.summonerName} />
    </div>
  );
}
