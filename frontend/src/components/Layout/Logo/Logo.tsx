import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import "./Logo.css"

const Logo = () => {
    return (
        <div className='logo-container'>
            <img src={logo} alt="Logo" className="logo" />
            {/* <h1 className="company-name"> Bank </h1> */}
        </div>);
};

export default Logo;