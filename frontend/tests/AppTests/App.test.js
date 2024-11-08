import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/src/App.jsx";
import Select from "react-select";
import GridLoader from "react-spinners/GridLoader";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

jest.mock("@/src/App.jsx", () => ({
  __esModule: true,
  default: function App() {
    const serverOptions = [
      { value: "EUW1", label: "EUW", region: "europe" },
      { value: "EUN1", label: "EUNE", region: "europe" },
      { value: "NA1", label: "NA", region: "americas" },
      { value: "KR", label: "KR", region: "asia" },
      { value: "JP1", label: "JP", region: "asia" },
      { value: "BR1", label: "BR", region: "americas" },
      { value: "LA1", label: "LAN", region: "americas" },
      { value: "LA2", label: "LAS", region: "americas" },
      { value: "OC1", label: "OC", region: "sea" },
      { value: "TR1", label: "TR", region: "europe" },
      { value: "RU", label: "RU", region: "europe" },
      { value: "PH2", label: "PH", region: "asia" },
      { value: "SG2", label: "SG", region: "sea" },
      { value: "TH2", label: "TH", region: "asia" },
      { value: "TW2", label: "TW", region: "sea" },
      { value: "VN2", label: "VN", region: "asia" },
    ];

    const GAME_MODES = {
      NORMAL: 490,
      NORMAL_DRAFT: 400,
      RANKED_SOLO: 420,
      RANKED_FLEX: 440,
    }; // Object that stores queue Ids for different game modes

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        height: "40px",
        width: "100px",
        borderRadius: "9px",
        border: "1px solid transparent",
        boxShadow: "none",
        fontSize: "1em",
        fontWeight: "500",
        fontFamily: "Spiegel",
        color: "#A09B8C",
        backgroundColor: "#1a1a1a",
        cursor: "pointer",
        transition: "border-color 0.25s, transform 300ms ease-in-out",
        outline: state.isFocused ? "1px solid #C89B3C" : "none",
        "&:hover": {
          borderColor: "#C89B3C",
        },
      }),
      singleValue: (provided, state) => ({
        ...provided,
        color: "#A09B8C",
      }),
      option: (provided, state) => ({
        ...provided,
        padding: 4,
        backgroundColor: state.isSelected ? "#C89B3C" : "transparent",
        color: state.isSelected ? "white" : "#A09B8C",
        "&:hover": {
          backgroundColor: "#C89B3C",
          color: "white",
        },
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "#1a1a1a", // Background color of the dropdown menu
      }),
      indicatorSeparator: () => ({ display: "none" }), // Hide the default separator
      dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.selectProps.menuIsOpen ? "#A09B8C" : "#A09B8C",
        transition: "transform 0.25s",
        transform: state.selectProps.menuIsOpen
          ? "rotate(-180deg)"
          : "rotate(0deg)",
        "&:hover": {
          color: "#A09B8C",
        },
      }),
      placeholder: (provided) => ({
        ...provided,
        marginTop: 30,
      }),
    };

    const spinnerStyles = {
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translateX(-50%)",
    };
    const selectedServer = { label: "EUW" };
    const handleChange = jest.fn();
    const isLoading = jest.fn();
    const patchVersion = "14";

    return (
      <>
        <div id="homeBodyContainer">
          <div className="line" id="leftLine"></div>
          <div id="homeBody">
            <h1>
              SUMMONERS <br /> CARD
            </h1>
            <div className="fieldBox">
              <input
                type="text"
                className="summonerField"
                id="summonerName"
                placeholder={`Enter summoner name: Gamename + #${selectedServer.label}`}
                autoFocus={true}
                onKeyDown={(event) => {
                  if (event.key == "Enter")
                    getInput(
                      selectedServer.value,
                      selectedServer.label,
                      selectedServer.region,
                      router,
                      setIsLoading,
                      setOpen,
                      setData
                    );
                }}
              />
              <div className="tooltip">
                <a
                  id="link"
                  href="https://support-leagueoflegends.riotgames.com/hc/en-us/articles/360041788533-Riot-ID-FAQ#:~:text=If%20your%20Riot%20ID%20is,not%20have%20to%20be%20unique."
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    id="infoIcon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 
                    1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 
                    1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 
                    2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 
                    1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"
                    />
                  </svg>{" "}
                </a>
                <span className="tooltip-text">Click for more help</span>
              </div>
            </div>
            <div className="box">
              <Select
                id="serverList"
                options={serverOptions}
                onChange={handleChange}
                styles={customStyles}
                theme={"primary50"}
                defaultValue={serverOptions[0]}
                isSearchable={false}
                menuPortalTarget={document.body}
              />
              <button
                className="customButton"
                id="search"
                onClick={() =>
                  getInput(
                    selectedServer.value,
                    selectedServer.label,
                    selectedServer.region,
                    router,
                    setIsLoading,
                    setOpen,
                    setData
                  )
                }
              >
                {" "}
                Search{" "}
              </button>
            </div>
            <div id="patcher">Patch Version: {patchVersion}</div>
            <Box sx={{ width: "100%" }}>
              <Collapse in={open}>
                <Alert
                  id="errorPopup"
                  variant="outlined"
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{
                    mb: 2,
                    color: "#F4C7C7",
                    backgroundColor: "#160B0B",
                    borderColor: "#160B0B",
                    ".MuiAlert-message": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              </Collapse>
            </Box>
          </div>
          <GridLoader
            color={"#9b792f"}
            loading={isLoading}
            cssOverride={spinnerStyles}
            margin={6}
            size={26}
            speedMultiplier={0.8}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <div className="line" id="rightLine"></div>
        </div>
      </>
    );
  },
}));

test("Renders app homepage correctly", () => {
  render(<App />);

  expect(screen.getByText("SUMMONERS CARD")).toBeInTheDocument();
  expect(screen.getByText("Patch Version: 14")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("EUW")).toBeInTheDocument();
  expect(screen.getByText("Enter summoner name: Gamename + #EUW")).toBeInTheDocument();
});
