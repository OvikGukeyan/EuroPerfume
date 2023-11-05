import React from 'react';
import styles from './Home.module.scss'
import { Carousel, Items } from '../../components';

const Home: React.FC = () => {
  return (
    <div className={styles.home_wrapper}>
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

      <Items/>
    </div>
  )
}

export default Home;