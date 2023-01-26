import React, { useState } from "react";
import "../navbar.css";
import logo from './imgs/logo.png'


function Navbar() {
    const [active, setActive] = useState("nav__menu");
    const [icon, setIcon] = useState("nav__toggler");
    const navToggle = () => {
    if (active === "nav__menu") {
        setActive("nav__menu nav__active");
    } else setActive("nav__menu");

    if (icon === "nav__toggler") {
        setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
    };
    return (
    <nav className="nav">
        <a href="/" className="nav__brand">
        <div className='logo_header'>
        <img src={logo} height='50vh'alt='Blocklytics'/><h1>Bloklytics</h1>
        </div>
    </a>
    <ul className={active}>
        <li className="nav__item">
        <a href="/" className="nav__link">
            <h3>Market</h3>
        </a>
        </li>
        <li className="nav__item">
        <a href="/wallet" className="nav__link">
            <h3>Connect Wallet</h3>
        </a>
        </li>
        <li className="nav__item">
        <a href="/wallet/swap" className="nav__link">
            <h3>Currency Converter</h3>
        </a>
        </li>
    </ul>
    <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
    </div>
    </nav>
);
}

export default Navbar;