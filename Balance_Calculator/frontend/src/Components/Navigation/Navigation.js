import React, { useState } from 'react'
import styled from 'styled-components'
import avatar from '../../img/icon.svg'
import { menuItems } from '../../utils/menuItems'
import { useGlobalContext } from '../../context/globalContext';
import './Navigation.scss'


function Navigation({active, setActive}) {
    

    const {clearInput} = useGlobalContext()
    
    //when change window, clear the input field, and set new window into active
    const itemClicked = (id) => {
        setActive(id)
        clearInput()
    }

    // Navigation bar(left) at Homepage
    return (
        <div className='nav-main'>
            <div className="user-con">
                <img src={avatar} alt="" />
                <div className="text">
                    <h2>Balance Calculator</h2>
                    <p>Team CyberWorker</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => itemClicked(item.id)}
                        className={active === item.id ? 'active': ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            {/* <div className="bottom-nav">
                <li>
                    {signout} Sign Out
                </li>
            </div> */}
        </div>
    )
}


export default Navigation