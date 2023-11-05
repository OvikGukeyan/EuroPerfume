import React from 'react';
import styles from './Items.module.scss'
import Item from '../Item';

const Items: React.FC = () => {


  return (
    <div className={styles.items_wrapper}>
      {[...Array(4)].map(() => (
        <Item/>
      ))}

        
    </div>
  )
}

export default Items;