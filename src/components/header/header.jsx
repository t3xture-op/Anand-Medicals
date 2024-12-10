import React from 'react'
import { useState } from 'react'
import './header.css'

function Header() {


const [toggle,setToggle] = useState(false)

  return (
    <div>
      <nav>
       <a href=""> <h1>Ananad Medicals</h1> </a>
        <div>
            <input type="search" placeholder='search'/>
            <i class="fa-solid fa-magnifying-glass search"></i>
        </div>
        <ul className='list'>
            <li><a href="">Cart</a></li>
            <li><a href="">Orders</a></li>
            <li><a href="">Add prescription</a></li>
            <li><i class="fa-solid fa-user user"  onClick={() => setToggle(true)} 
            ></i>
            {toggle && (
              <div className="setToggle">
                <button>Login</button>
                <button>Sign Up</button>
              </div>
            )}</li>
        </ul>
      </nav>
    </div>
  )
}

export default Header
