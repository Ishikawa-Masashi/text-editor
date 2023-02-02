import * as React from 'react';

import { Box, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { cloneElement } from 'react';
import { useMenuBarContext } from './MenuBar';

type Props = {
  isMenuBarDescendant?: (element: HTMLElement) => boolean | undefined;
  menuBarEvents?: any;
  onSelect?: any;
  open?: boolean;
};

const animationKeyframes1 = keyframes`
0% {
  opacity: 0;
  transform: translate3d(0px, -10px, 0px);
  pointer-events: none;
}
100% {
  opacity: 1; 
  transform: translate3d(0px, 0px, 0px);
  pointer-events: auto;
}
`;

const animation = `${animationKeyframes1} 0.367s cubic-bezier(0.1, 0.9, 0.2, 1) 0s 1 normal both`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Menu(props: React.PropsWithChildren<Props>) {
  const { menuBarEvents, onSelect, open, children } = props;

  const { isMenuBarDescendant } = useMenuBarContext();

  const renderChild = (child: React.ReactNode) => {
    return cloneElement(child as React.ReactElement, {
      isMenuBarDescendant,
      menuBarEvents,
      onSelect,
    });
  };

  return (
    <Box
      as={motion.div}
      animation={animation}
      box-shadow="rgb(0, 0, 0) 0px 2px 4px"
      cursor="default"
      display={open ? 'block' : 'none'}
      padding="6.5px 0"
      position="absolute"
      userSelect="none"
      whiteSpace="nowrap"
      zIndex={2000}
      role="menu"
      backgroundColor="#252526"
    >
      {React.Children.map(children, renderChild)}
    </Box>
  );
}
