import React, { useEffect, useState } from 'react';
import { useFloating, shift, flip, offset } from '@floating-ui/react-dom';

interface Props {
  children: React.ReactNode;
  content: React.ReactNode | string;
  disableClass?: boolean;
}

function Tooltip({ children, content, disableClass = false }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const { x, y, reference, floating, strategy, update } = useFloating({
    placement: 'right',
    middleware: [shift(), flip(), offset(10)]
  });

  useEffect(() => {
    if (isVisible) {
      update();
    }
  }, [isVisible, update]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <span
        role="dialog"
        ref={reference}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {isVisible && (
        <div
          ref={floating}
          className={disableClass ? '' : 'tooltip'}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
            zIndex: 10
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}

export default Tooltip;
