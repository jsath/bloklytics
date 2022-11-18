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
        let day = 86400000/1000
        props.setStart(end-day);
        props.setInt('m30')
        props.setDateFormat('HH:mm:ss')
    }

    const sevenDay = (e) => {
        updateTabs(e);
        let daySeven = 604800000/1000
        props.setStart(end-daySeven)
        props.setInt('h2')
        props.setDateFormat('D-YYYY h:mma')
    }

    const oneMonth = (e) => {
        updateTabs(e);
        let month = 2629743000/1000
        props.setStart(end-month);
        props.setInt('h12')
        props.setDateFormat("D MMM 'YY")
    }

    const threeMonth = (e) => {
        updateTabs(e);
        let monthThree = 7889229000/1000
        props.setStart(end-monthThree);
        props.setInt('h12')
        props.setDateFormat("D MMM 'YY")
    }

    const ytd = (e) => {
        updateTabs(e);
        let yearToDate = 31556926000/1000
        props.setStart(end-yearToDate);
        props.setInt('d1')
        props.setDateFormat("D MMM 'YY")
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