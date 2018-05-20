import * as ReactDOM from 'react-dom';

require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageData = require('../data/imageData.json');

function genImageUrl(imageDataArr) {
  for (let i = 0, length = imageDataArr.length; i < length; i++) {
    let imageData = imageDataArr[i];
    imageData.imageURL = require('../images/' + imageData.fileName);
    imageDataArr[i] = imageData;
  }

  return imageDataArr;
}

imageData = genImageUrl(imageData);

class ImageFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }


    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img className='img-item' src={this.props.data.imageURL} alt={this.props.data.title}/>

        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}


function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false,
          isCenter : false,
        }*/
      ]
    };
  }

  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  };

  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,

      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,

      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    imgsArrangeCenterArr[0] = {
      pos: Constant.centerPos,
      rotate: 0,
      isCenter: true
    };

    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    });

    for (let i = 0, length = imgsArrangeArr.length, halfLength = length / 2; i < length; i++) {
      let hPosRangeLORX = null;
      if (i < halfLength) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  inverse(index) {
    return function () {
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  }

  center(index) {
    return function () {
      this.rearrange(index)
    }.bind(this);
  }

  render() {
    let controllerUnits = [],
      imgFigures = [];

    imageData.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImageFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}
                                   inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                           center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className='stage' ref='stage'>
        <section className='img-sec'>
          {imgFigures}
        </section>
        <nav className='controller-nav'>
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

class ControllerUnit extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }


    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let className = 'controller-unit';
    className += this.props.arrange.isCenter ? ' is-center' : '';
    className += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <span className={className} onClick={this.handleClick}>
      </span>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
