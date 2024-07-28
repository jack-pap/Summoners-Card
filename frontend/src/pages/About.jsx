import '../App.css'
import { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function About() {

  return (
    <>
      <div id='homeBody'>
        <div id='aboutContent'>

          <h1>About & Privacy</h1>
          Welcome to Summoners Card: Unveiling the Stories Behind the Rift!

          Summoners Card is more than just a website; it's your personalized gateway to the rich tapestry of League of Legends. Step into a realm where your Summoner's journey is celebrated, analyzed, and crafted into a digital narrative. Here, we transcend the mere statistics of the game, delving deep into the essence of your Summoner's experience.

          Discover Your Legend:
          Uncover the secrets behind your Summoner's history. Summoners Card goes beyond the numbers, revealing the victories, defeats, and pivotal moments that have shaped your journey through the League of Legends universe. Your Summoner's Card is a testament to your evolution as a player and a hero on the Rift.

          Insightful Analytics:
          Dive into comprehensive analytics tailored to your unique playstyle. Summoners Card provides in-depth statistical analysis, showcasing your strengths, areas for improvement, and highlighting strategies that have proven most effective for you. Whether you're a strategic mastermind or a precision player, our analytics empower you to refine your skills and dominate the battlefield.

          Showcase Your Achievements:
          Your Summoners Card is your virtual trophy room. Display your most glorious triumphs, from epic pentakills to hard-fought victories in ranked matches. Share your achievements with friends and fellow Summoners, creating a legacy that transcends the digital battlefield.
        </div>
        <Accordion>
          <AccordionSummary
            sx={{
              backgroundColor: "#1a1a1a",
              color: "#918c7e",
            }}
            expandIcon={<ArrowDropDownIcon sx={{ color: "#918c7e" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>What can you see?</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "#202020",
              color: "#c89b3c"
            }}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{
              backgroundColor: "#1a1a1a",
              color: "#918c7e"
            }}
            expandIcon={<ArrowDropDownIcon sx={{ color: "#918c7e" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>What can you see?</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "#202020",
              color: "#c89b3c"
            }}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  )
}


export default About