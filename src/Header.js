import React, { useState, useEffect, useRef } from 'react'

const Header = ({ menuItems, selected, onSelect }) => {

  return (
    <header className="app-header">
        <div className="vis-title">
          The 4 Quadrants Bar Chart Examples
        </div>
        <ul className="menu">
            {menuItems.map(item => 
                <li
                    key={`item-${item.key}`} 
                    className={`item ${selected === item.key ? "selected" : ""}`}
                    onClick = {() => onSelect(item.key)}
                >
                    {item.name}
                </li>
            )}
        </ul>
    </header>
  )
}

export default Header;


