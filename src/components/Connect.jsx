import React, { Component } from 'react';
const ModelViewer = require('@metamask/logo');


const style = {
    marginTop: "50px"  
};

class Connect extends Component {

    
    componentDidMount() {
    this.viewer = ModelViewer({
        pxNotRatio: true,
        width: 200,
        height: 200,
        followMouse: true,
    });
    this.el.appendChild(this.viewer.container);
    }

    componentWillUnmount() {
    this.viewer.stopAnimation();
    }


    render() {
    return (
        <>
        <p>{ModelViewer}</p>
        
    <div ref={el => (this.el = el)} style={style}/>

    </>
    );
}
}

export default Connect;