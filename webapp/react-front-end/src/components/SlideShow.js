import React, { Component } from "react";
import { Slide } from 'react-slideshow-image';
import { RingLoader } from "react-spinners";

 
const slideImages = [
  'https://storage.cloud.google.com/visualizer-images/slide_3.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_4.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_5.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_6.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_7.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_8.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_9.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_10.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_11.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_12.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_13.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_14.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_15.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_16.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_17.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_18.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_19.jpeg?supportedpurview=project',
  'https://storage.cloud.google.com/visualizer-images/slide_20.jpeg?supportedpurview=project',
];
 
const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  onChange: (oldIndex, newIndex) => {
    console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  }
}
 
class Slideshow extends Component {
  render() {
    return (
      <div className="slide-container">
        <div className="sweet-loading ">
          <h5 className="greenish">Crawling...</h5>
          <RingLoader
            sizeUnit={"px"}
            size={80}
            color={"#28a745"}
            loading={this.props.loading}
          />
        </div>

        <Slide {...properties}>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[0]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[1]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[2]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[3]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[4]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[5]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[6]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[7]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[8]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[9]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[10]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[11]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[12]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[13]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[14]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[15]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[16]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
          <div className="each-slide">
            <div style={{'backgroundImage': `url(${slideImages[17]})`}}></div>
            <span>Photo Credit: https://unsplash.com/ </span>
          </div>
        </Slide>
      </div>
    )
  }
}

export default Slideshow;
