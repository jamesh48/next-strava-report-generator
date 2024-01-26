import React, { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';

const SwipeableContainer = styled('div')({
  width: '100%',
  height: '100%',
  // overflow: 'hidden',
  position: 'relative',
});

const SwipeableContent = styled('div')({
  display: 'flex',
  transition: 'transform 0.3s ease',
});

const SwipeableItem = styled('div')({
  flex: '0 0 100%',
});

const Swipeable = ({ children }: { children: ReactNode }) => {
  const childrenArray = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const difference = startX - currentX;

    // Ensure swiping left/right
    if (Math.abs(difference) < 10) return;

    // Prevent default behavior of touch scroll
    e.preventDefault();

    // Calculate the index to move to based on swipe direction
    const newIndex = difference > 0 ? currentIndex + 1 : currentIndex - 1;
    setCurrentIndex(Math.max(0, Math.min(childrenArray.length - 1, newIndex)));
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
  };

  return (
    <SwipeableContainer
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <SwipeableContent
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {React.Children.map(children, (child, index) => (
          <SwipeableItem key={index}>{child}</SwipeableItem>
        ))}
      </SwipeableContent>
    </SwipeableContainer>
  );
};

export default Swipeable;
