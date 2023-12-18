import React from 'react';
import { Link } from 'react-router-dom';

function Header() {

  return (
    <>
      <header className="header">
        <Link to='/privacy' style={{ color: 'inherit', textDecoration: 'inherit' }} className="headerChildren">
          PRIVACY
        </Link>
        <a style={{textDecoration: 'inherit' }} href='/' className="headerChildren" id="minih1">
            SUMMONERS CARD
        </a>
        <Link to='/champions' style={{ color: 'inherit', textDecoration: 'inherit' }} className="headerChildren">
          CHAMPIONS
        </Link>
      </header>
    </>
  );
}

export default Header;
