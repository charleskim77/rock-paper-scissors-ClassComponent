import React, { Component } from "react";

export default class BoxClass extends Component {
    render() {
        console.log("props", this.props);

        const defaultImageUrl = process.env.PUBLIC_URL + '/images/question.gif';

        let resultStyle = {};
        let boxStyle = {};
        let imageStyle = {};

        if (this.props.result === "WIN") {
            resultStyle = { color: 'red' };
            boxStyle = { backgroundColor: '#ffcd00' };
        } else if (this.props.result === "LOSE") {
            resultStyle = { color: 'black' };
            boxStyle = { backgroundColor: '#8f8f8f' };
            imageStyle = { 
                filter: 'grayscale(100%)',
                transform: 'scale(0.8)'  // 이미지 크기를 80%로 줄임
            };
        }

        return (
            <div className='col-6'>
                <div className='d-flex flex-column align-items-center box' style={boxStyle}>
                    <h1>{this.props.title}</h1>
                    <img 
                        src={this.props.item && this.props.item.img ? this.props.item.img : defaultImageUrl} 
                        alt={this.props.item ? this.props.item.name : 'default'}
                        style={imageStyle}
                    />
                    <h2 style={resultStyle}>{this.props.result}</h2>
                </div>
            </div>
        )
    }
}