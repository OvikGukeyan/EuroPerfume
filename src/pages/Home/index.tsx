import React from 'react';
import { Carousel } from '../../components';

const Home: React.FC = () => {
  return (
    <div>
      <Carousel>
        <div className='first'>
          <img src="./assets/slide1.webp" alt="" />
        </div>
        <div className='second'>
        <img src="./assets/slide2.webp" alt="" />

        </div>
        <div className='third'>
        <img src="./assets/slide3.webp" alt="" />

        </div>
      </Carousel>
    </div>
  )
}

export default Home;