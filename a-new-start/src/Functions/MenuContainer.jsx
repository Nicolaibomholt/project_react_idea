import React, { useState, useContext } from "react";
import '../Menu.scss'
import { Link, navigate } from "@reach/router";
import { UserContext } from "../providers/UserProvider";

const menuItemsOptions = [
    { text: 'Profile' },
    { text: 'Map' },
    { text: 'About' },
    { text: 'Contact' },
]

export default function MenuContainer() {
    const user = useContext(UserContext);
    const [activeItem, setActiveItem] = React.useState('')
    const [activeItemPos, setActiveItemPos] = React.useState(0)
    const [activeItemColor, setActiveItemColor] = React.useState('')

    const createClickHandler = (activeItem) => e => {
        e.preventDefault()

        setActiveItem(activeItem)
        setActiveItemPos(document.getElementById(activeItem).offsetTop)
        setActiveItemColor(window.getComputedStyle(document.getElementById(activeItem)).getPropertyValue('background-color'))
        if (activeItem==="Profile") {
            navigate('/')
        }
        else {
        navigate(`/${ activeItem }`)
    }
    }

    const menuItems = menuItemsOptions.map(item => <MenuItem item={item} createClickHandler={createClickHandler} />)

    if (user === undefined) {
        return (<div></div>)
    }
    else {
    return (
        <div className='menu-container'>
            <span className='menu-item--active' style={{ top: activeItemPos, backgroundColor: activeItemColor }} />
            { menuItems}
        </div>
    )
}
}

///////////////////
// MenuItem      //
///////////////////
function MenuItem({ createClickHandler, item }) {
    const clickHandler = createClickHandler(item.text)

    return (
        <div
            className='menu-item'
            id={item.text}
            onClick={clickHandler}
        >
            { item.text.toUpperCase()}
        </div>
    )
}