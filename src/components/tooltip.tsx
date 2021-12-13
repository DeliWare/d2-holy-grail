import React, { useState } from 'react';

function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) {
    return children;
  }

  return (
    <div
      role='presentation'
      className='tooltip-wrapper'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className='tooltip'>{content}</div>}
    </div>
  );
}

export default Tooltip;
