import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="logo">
            🚀 CryptoRules
          </div>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/strategies">Strategies</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/backtest">Backtest</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;