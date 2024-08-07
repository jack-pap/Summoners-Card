import React from 'react';
import { Link } from 'react-router-dom';

function Header() {

  return (
    <>
      <header className="header">
        <a style={{textDecoration: 'inherit' }} href='/' className="headerChildren" id="minih1">
            SUMMONERS CARD
        </a>
      </header>
    </>
  );
}

export default Header;
