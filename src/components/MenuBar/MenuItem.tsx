import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import {
  cloneElement,
  useRef,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  ReactElement,
} from 'react';
import { useMenuBarContext } from './MenuBar';

type Props = {
  isMenuBarDescendant?: (element: HTMLElement) => boolean | undefined;
  menuBarEvents?: any;
  onSelect?: any;
  label?: string;
  command?: any;
  isTopLevel?: boolean;
  children: ReactNode;
  shortcut?: string;
  icon?: ReactNode;
};

function TreeCollapsedDark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0719 7.99999L5.71461 12.3573L6.33333 12.976L11 8.30935V7.69064L6.33333 3.02397L5.71461 3.64269L10.0719 7.99999Z"
        fill="#C5C5C5"
      />
    </svg>
  );
}

export function MenuItem(props: Props): JSX.Element {
  const {
    isTopLevel,
    icon = <React.Fragment></React.Fragment>,
    children,
  } = props;

  const elementRef = useRef<HTMLDivElement>(null);

  const { isMenuBarActive, isMenuBarDescendant } = useMenuBarContext();

  const [open, setOpen] = useState(false);

  const onDocumentClick = useCallback(
    (ev: MouseEvent) => {
      if (!isChildElement(ev.target as Node)) {
        // setState({ open: false });
        setOpen(false);
        // ev.stopPropagation();
      }
    },
    [setOpen]
  );

  const isChildElement = (element: Node) => {
    // return this.getDOMNode().contains(element);
    return elementRef.current?.contains(element);
  };

  React.useEffect(() => {
    return () => {
      unbindCloseHandlers();
    };
  }, []);

  const onMenuBarMouseOver = useCallback(
    (e: React.MouseEvent) => {
      e.persist();
      if (!isChildElement(e.target as Node)) {
        // setState({ open: false });
        setOpen(false);
      }
    },
    [setOpen]
  );

  const bindCloseHandlers = React.useCallback(() => {
    document.addEventListener('click', onDocumentClick, false);
    props.menuBarEvents.addMouseOverListener(onMenuBarMouseOver);
  }, [onDocumentClick, onMenuBarMouseOver, props]);

  const unbindCloseHandlers = React.useCallback(() => {
    document.removeEventListener('click', onDocumentClick, false);
    props.menuBarEvents.removeMouseOverListener(onMenuBarMouseOver);
  }, [onDocumentClick, onMenuBarMouseOver, props]);

  useEffect(() => {
    if (open) {
      bindCloseHandlers();
      return;
    }
    unbindCloseHandlers();
  }, [open, bindCloseHandlers, unbindCloseHandlers]);

  const hasSubmenu = () => {
    return React.isValidElement(children);
  };

  const getLabel = () => {
    return hasSubmenu() ? props.label : children;
  };

  const getShortcut = () => {
    // return props.shortcut;

    return hasSubmenu() ? (
      !isTopLevel && (
        <Flex padding="0 1em">
          <TreeCollapsedDark />
        </Flex>
      )
    ) : (
      <Box padding="0 2em">{props.shortcut}</Box>
    );
  };

  const getIcon = () => {
    return (
      !isTopLevel && (
        <Flex width="2em" justify="center" align="center">
          {icon}
        </Flex>
      )
    );
  };

  const renderSubmenu = () => {
    if (!hasSubmenu()) {
      return;
    }

    const menu = props.children as ReactElement;

    return cloneElement(menu, {
      isMenuBarDescendant,
      menuBarEvents: props.menuBarEvents,
      onSelect: onSelect,
      open,
    });
  };

  const onSelect = (key: any) => {
    props.onSelect(key);
    setOpen(false);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (hasSubmenu()) {
      toggleOpen();
    } else {
      props.onSelect(props.command);
    }
  };

  const onMouseOver = React.useCallback(() => {
    if (isTopLevel && isMenuBarActive) {
      setOpen(true);
    }

    if (!isTopLevel && hasSubmenu()) {
      setOpen(true);
    }
  }, [isTopLevel, isMenuBarActive]);

  const onMouseOut = (e: React.MouseEvent) => {
    if (
      hasSubmenu() &&
      isMenuBarDescendant(e.relatedTarget as HTMLElement) &&
      !isChildElement(e.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Box onMouseOver={onMouseOver} onMouseOut={onMouseOut} ref={elementRef}>
      <Flex
        padding="0 8px"
        cursor="default"
        userSelect="none"
        justifyContent="space-between"
        alignItems="center"
        onClick={onClick}
        _hover={{
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
        backgroundColor={open ? 'rgba(255, 255, 255, 0.1)' : ''}
      >
        <Flex>
          {getIcon()}
          {getLabel()}
        </Flex>
        {getShortcut()}
      </Flex>
      <Box
        position="absolute"
        left={props.isTopLevel ? 'initial' : '100%'}
        marginTop={props.isTopLevel ? 'initial' : '-1.9rem'}
        // boxShadow="rgb(0, 0, 0) 0px 2px 4px"
      >
        {renderSubmenu()}
      </Box>
    </Box>
  );
}
