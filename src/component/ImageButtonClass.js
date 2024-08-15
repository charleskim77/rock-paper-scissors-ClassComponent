import React, { Component } from "react";

export default class ImageButtonClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: props.defaultImage
        };
    }

    handleMouseEnter = () => {
        this.setState({ imgSrc: this.props.hoverImage });
    }

    handleMouseLeave = () => {
        this.setState({ imgSrc: this.props.defaultImage });
    }

    render() {
        return (
            <button
                className="image-button"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onClick={this.props.onClick}
            >
                <img src={this.state.imgSrc} alt="버튼 이미지" />
            </button>
        );
    }
}
