import React from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';

import MenuBarEvents from './MenuBarEvents';

type Props = React.PropsWithChildren<
  Omit<FlexProps, 'onSelect'> & { onSelect: (command: string) => void }
>;

const MenuBarContext = React.createContext({
  isMenuBarActive: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMenuBarDescendant: (element: HTMLElement) =>
    undefined as undefined | boolean,
});

export const useMenuBarContext = () => React.useContext(MenuBarContext);

export function MenuBar(props: Props) {
  const { children } = props;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isMenuBarActive, setIsMenuBarActive] = React.useState(false);
  const [events] = React.useState(new MenuBarEvents());

  const handleDocumentClick = React.useCallback(() => {
    setIsMenuBarActive(false);
    // ev.stopPropagation();
  }, [setIsMenuBarActive]);

  const bindSetInactiveHandler = React.useCallback(() => {
    document.addEventListener('click', handleDocumentClick);
  }, [handleDocumentClick]);

  const unbindSetInactiveHandler = React.useCallback(() => {
    document.removeEventListener('click', handleDocumentClick, false);
  }, [handleDocumentClick]);

  React.useEffect(() => {
    bindSetInactiveHandler();
    return () => {
      unbindSetInactiveHandler();
    };
  }, [handleDocumentClick]);

  const isMenuBarDescendant = (element: HTMLElement) =>
    elementRef.current?.contains(element);

  const onMouseOver = (e: React.MouseEvent) => {
    events.emitMouseOver(e);
  };

  return (
    <MenuBarContext.Provider value={{ isMenuBarActive, isMenuBarDescendant }}>
      <Flex
        onClick={(ev) => {
          ev.stopPropagation();
          setIsMenuBarActive(!isMenuBarActive);
        }}
        onMouseOver={onMouseOver}
        ref={elementRef}
      >
        {React.Children.map(
          children as React.ReactElement,
          (child: React.ReactElement) => {
            return React.cloneElement(child, {
              isTopLevel: true,
              menuBarEvents: events,
              onSelect: props.onSelect,
            });
          }
        )}
      </Flex>
    </MenuBarContext.Provider>
  );
}
