import React, { useState } from 'react'
import "../Tab.css";

const Dates = (props) => {

    const[end] = useState(props.end)
    const updateTabs = (evt) => {
        var i, tablinks;
    
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        evt.currentTarget.className += " active";
    }

    const oneDay = (e) => {
        updateTabs(e);
        props.setStart(end-86400000);
        props.setInt('h1')
    }

    const sevenDay = (e) => {
        updateTabs(e);
        // let newInput = props.userInput;
        // newInput.start = props.userInput.end-604800000
        // console.log(newInput)
        props.setStart(end-604800000)
        props.setInt('h12')
    }

    const oneMonth = (e) => {
        updateTabs(e);
        props.setStart(end-2629743000);
        props.setInt('d1')
    }

    const threeMonth = (e) => {
        updateTabs(e);
        props.setStart(end-7889229000);
        props.setInt('d1')
    }

    const ytd = (e) => {
        updateTabs(e);
        props.setStart(end-31556926000);
        props.setInt('d1')
    }


    
return (
    <>
    <div className="tab">

        <button className="tablinks" onClick={(e) => oneDay(e)}>1D</button>
        <button className="tablinks" onClick={(e) => sevenDay(e)}>7D</button>
        <button className="tablinks" onClick={(e) => oneMonth(e)}>1M</button>
        <button className="tablinks" onClick={(e) => threeMonth(e)}>3M</button>
        <button className="tablinks" onClick={(e) => ytd(e)}>YTD</button>
    </div>
    </>
)
}

export default Dates