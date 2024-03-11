/* eslint-disable react/no-unescaped-entities */
import './App.css'
import gitIcon from '../assets/git.png';

function Footer() {

  return (
    <>
      <footer className='footer'>
        <div id="footerLine" />
        <div className='image-container'>
          © 2023 JACK PAPAIOANNOU
          <a href="https://github.com/jack-pap" target="_blank" rel="noreferrer"><img id="gitIcon" src={gitIcon} alt="Github Icon" /></a>
        </div>
        Summoners Card isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or
        anyone officially involved in producing or managing Riot Games properties.
        Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </footer>
    </>
  )
}

export default Footer