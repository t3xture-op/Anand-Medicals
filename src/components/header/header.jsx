import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import './header.css';

function Header() {
//   const [isSidebarconst [searchText, setSearchText] = useState('');

const [searchText, setSearchText] = useState('');

const handleSearchChange = (e) => {
  setSearchText(e.target.value);
};

const clearSearch = () => {
  setSearchText('');
};
const [isMenuVisible, setIsMenuVisible] = useState(false);
const [cartCount, setCartCount] = useState(3);
const toggleMenu = () => {
  setIsMenuVisible(!isMenuVisible); // Toggle menu visibility
};
  return (
          <nav className='navbar'>
            <div className='head-anand box-1  '>
             <h1 className='text'> <a href="" >Anand Medicals</a></h1>
            </div>
            <div className='head-link box-2'>
                 <div className="search-container">
                      <input type="text" placeholder="Search" className="search-input" value={searchText}
            onChange={handleSearchChange} />
                     <i className="fa-solid fa-magnifying-glass search-icon"></i>
          {searchText && (
            <span className="clear-icon" onClick={clearSearch}>&#10005;</span>
          )}
                  </div>

            </div>
            <div className="menu-icon" onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>
      <div className={`head-list ${isMenuVisible ? "show" : ""}`}>
                      
                <ul className='list'>
                  <li className="hideOnMobile cart-item"><a href="javascript:void(0)">Cart</a> {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </li>
                  <li className="hideOnMobile"><a href="javascript:void(0)">Orders</a></li>
                  <li className="hideOnMobile"><a href="javascript:void(0)">Add prescription</a></li>
                  <li className="hideOnMobile"><button className='log'>login</button></li>
                  <li className="hideOnMobile"><button className='log'>sign up</button></li>
                </ul>            
            </div>
          </nav>
  );
}

export default Header;
