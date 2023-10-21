import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
    return (
        <header className={styles.header_wrapper}>
            <div className={styles.banner}>
                <p>Место для акций и специальных предложений !!!</p>
            </div>
            <div className={styles.header_content}>
                <div className={styles.logo}>
                    <img src="./assets/perfume_logo.png" alt="" />
                </div>

                <div className={styles.search}>
                    <input placeholder='Search' type="text" />
                    <div className={styles.search_icon}>
                        <svg color="#fff" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
                    </div>
                </div>

                <div className={styles.user_cart}>
                    <div className={styles.language}>
                        <p>EN</p>
                        <div className={styles.drop_down}>
                            <p>DE</p>
                            <p>RU</p>
                            <p>UA</p>
                        </div>

                    </div>
                    <img src="./assets/bookmark.png" alt="" />
                    <img src="./assets/user.png" alt="" />
                    <img src="./assets/cart.png" alt="" />
                </div>
            </div>
            <div className={styles.filters}>
                <ul>
                    <li>
                        <p>Sex</p>
                        {/* <ul className={styles.popup}>
                            <li>Man</li>
                            <li>Woman</li>
                            <li>Unisex</li>
                        </ul> */}
                    </li>
                    <li>Brand</li>
                    <li>Aroma</li>
                    <li>Niche</li>
                    <li>New</li>
                    <li>Action</li>

                </ul>
            </div>
            
        </header>
    )
}

export default Header;