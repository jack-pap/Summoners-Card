import React, { memo } from "react";
import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";

const ChampionEntry = memo(
  ({
    championName,
    gamesPlayed,
    winrate,
    championImage,
    championMasteryImage,
  }) => (
    <div className="champEntry">
      <div id="champContainer">
        <div className="champImage">
          <Image
            src={championImage}
            width={47}
            height={47}
            alt={`${championName}`}
          />
          <Image
            id="championMasteryImage"
            src={championMasteryImage}
            width={24}
            height={24}
            alt={`Mastery`}
          />
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

ChampionEntry.displayName = "ChampionEntry";

export default ChampionEntry;
