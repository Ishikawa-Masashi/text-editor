import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex } from '@chakra-ui/react';
// import styled from 'styled-components';

import { fileTree, toggleDirectory } from '../../state/explorer';
import { darkTheme } from '../../themes/darkTheme';

// import type { ThemeProps } from '../Providers/ThemeProvider';

// const DirectoryContainer = styled.div`
//   color: ${({ theme }: ThemeProps) => theme.elements.explorer.item.text.color};
//   display: flex;
//   cursor: pointer;
// `;

// const Icon = styled.div`
//   color: ${({ theme }: ThemeProps) => theme.elements.explorer.item.text.color};
//   display: flex;
//   background-image: url('/icons/chevron-right.svg');
//   background-repeat: no-repeat;
//   background-position: center;
//   width: 20px;
// `;

type Props = { path: string };

export const Directory = (props: Props) => {
  const { path } = props;
  const name = path.split('/').pop();
  const indent = path.split('/').length ?? 0;
  const isOpen = fileTree.openDirs.has(path);
  return (
    <Flex
      height="24px"
      align="center"
      whiteSpace="nowrap"
      color={darkTheme.explorer.item.text.color}
      cursor="pointer"
      style={{ paddingLeft: `${indent}rem` }}
      onMouseDown={() => {
        toggleDirectory(path);
      }}
      _hover={{ backgroundColor: darkTheme.explorer.item.hover.background }}
    >
      {isOpen ? (
        <ChevronDownIcon w="24px" h="24px" />
      ) : (
        <ChevronRightIcon w="24px" h="24px" />
      )}
      {name}
    </Flex>
  );
};
