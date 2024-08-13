import React from 'react'

const Box = (props) => {
    console.log("props", props);

    const defaultImageUrl = process.env.PUBLIC_URL + '/images/question.gif';

    let resultStyle = {};
    if (props.result === "WIN") {
        resultStyle = { color: 'red' };
    } else if (props.result === "LOSE") {
        resultStyle = { color: 'black', filter: 'grayscale(100%)' };
    }

    return (
        <div className='col-6'>
            <div className='d-flex flex-column align-items-center box'>
                <h1>{props.title}</h1>
                <img 
                    src={props.item && props.item.img ? props.item.img : defaultImageUrl} 
                    alt={props.item ? props.item.name : 'default'}
                    style={props.result === "LOSE" ? { filter: 'grayscale(100%)' } : {}}
                />
                <h2 style={resultStyle}>{props.result}</h2>
            </div>
        </div>
    )
}

export default Box