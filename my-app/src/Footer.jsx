import './App.css'

function Footer() {

  return (
    <>
      <footer className='footer'>
        <div id="footerLine" />
        <div className='image-container'>
          © 2023 JACK PAPAIOANNOU
          <a href="https://github.com/jack-pap" target="_blank"><img id="image" src="src\assets\git.png" alt="Github Icon" /></a>
        </div>
        Summoners Card isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or
        anyone officially involved in producing or managing Riot Games properties.
        Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </footer>
    </>
  )
}

export default Footer