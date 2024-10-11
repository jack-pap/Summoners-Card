import React, { memo } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const ChampionEntry = memo(
  ({ championName, gamesPlayed, winrate, championImage }) => (
    <div className="champEntry">
      <div id="champContainer">
        <div className="champImage">
          <img src={championImage} alt={championName} />
        </div>
        <div className="champName">{championName}</div>
      </div>
      <div className="champWinrate">
        <ProgressBar
          completed={winrate === 0 ? 1 : winrate}
          width="125px"
          height="17px"
          bgColor="#C89B3C"
          baseBgColor="#383838"
          animateOnRender={true}
          borderRadius="3px"
          customLabel={winrate === 0 ? "0%" : undefined}
          labelAlignment="left"
        />
      </div>
      <div className="gamesPlayed">{gamesPlayed} Played</div>
    </div>
  )
);

export default ChampionEntry;
