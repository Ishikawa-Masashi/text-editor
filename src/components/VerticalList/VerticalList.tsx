import * as React from 'react';

import { useVirtual } from '@ishikawa-masashi/react-virtual';

type Props<T> = {
  list: T[];
  index?: number;
  renderItem: (item: T, index: number) => JSX.Element;
  estimateSize?: (index?: number) => number;
  width: number;
  height: number;
};

export function VerticalList<T>(props: Props<T>) {
  const {
    list,
    renderItem,
    estimateSize = () => 35,
    index = -1,
    width,
    height,
  } = props;

  const parentRef = React.useRef<HTMLDivElement>(null);
  const lockRef = React.useRef(true);

  const virtualizer = useVirtual({
    size: list.length,
    parentRef,
    estimateSize: React.useCallback(estimateSize, [list]),
    overscan: 5,
  });

  // React.useEffect(() => {
  //   lockRef.current = true;
  // }, []);

  React.useEffect(() => {
    if (lockRef.current) {
      if (index !== -1) {
        virtualizer.scrollToIndex(index, 'center');
      }
    }
  }, [virtualizer, index]);

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          overflowY: 'scroll',
        }}
        onWheel={() => {
          lockRef.current = false;
        }}
      >
        <div
          style={{
            height: `${virtualizer.totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.virtualItems.map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderItem(list[virtualRow.index], virtualRow.index)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
