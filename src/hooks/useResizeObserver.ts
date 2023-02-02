import * as React from 'react';

export function useResizeObserver(
  ref: React.RefObject<HTMLElement>
): [number, number] {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (width !== entries[0].contentRect.width) {
        setWidth(entries[0].contentRect.width);
      }

      if (height !== entries[0].contentRect.height) {
        setHeight(entries[0].contentRect.height);
      }
    });

    if (ref.current !== null) {
      resizeObserver.observe(ref.current);
    }

    return () => void resizeObserver.disconnect();
  }, [ref]);

  return [width, height];
}
