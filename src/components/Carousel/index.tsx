import React, { useEffect, useState, Children, ReactNode, ReactElement } from 'react'
import styles from './Carousel.module.scss'

const PAGE_WIDTH = 1200

type CarouselTypes = {
  children: ReactNode
}

const Carousel: React.FC<CarouselTypes> = ({ children }) => {
  const [pages, setPages] = useState<ReactNode[]>([])
  const [offset, setOffset] = useState(0)

  const handleLeftArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset + PAGE_WIDTH
      const maxOffset = -(PAGE_WIDTH * (pages.length - 1))
      const result = newOffset <= 0 ? newOffset : maxOffset;
      // return Math.min(newOffset, 0)
      return result
    })
  }
  const handleRightArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset - PAGE_WIDTH

      const maxOffset = -(PAGE_WIDTH * (pages.length - 1))

      const result = newOffset >= maxOffset ? newOffset : 0;

      // Math.max(newOffset, maxOffset)
      return result
    })
  }
  useEffect(() => {
    const newChildren = Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return <div
          style={{
            minWidth: `${PAGE_WIDTH}px`,
            maxWidth: `${PAGE_WIDTH}px`,
            height: '100%',
            ...child.props.style 
          }}
        >
          {child}
        </div>;
      }
      return null;
    }) as ReactElement[];
    setPages(newChildren);
  }, [children]);

  return (
    <div className={styles.main_container}>
      <div className={styles.window}>
        <svg className={styles.left} onClick={handleLeftArrowClick} id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polygon points="352,115.4 331.3,96 160,256 331.3,416 352,396.7 201.5,256 " /></svg>
        <div className={styles.all_pages_container}
          style={{
            transform: `translateX(${offset}px)`,
          }}
        >
          {pages}
        </div>
        <svg className={styles.right} onClick={handleRightArrowClick} id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 " /></svg>
      </div>
    </div>
  )
};

export default Carousel;