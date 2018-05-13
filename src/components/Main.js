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

class AppComponent extends React.Component {
  render() {
    return (
      <section className='stage'>
        <section className='img-sec'>
        </section>
        <nav className='controller-nav'>
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
