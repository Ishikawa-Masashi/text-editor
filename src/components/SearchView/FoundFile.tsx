import * as React from 'react';
// import styled from 'styled-components';

import { fileTree, refresh, setSelectedItem } from '../../state/explorer';
import * as paths from 'path';
// import { ThemeProps } from '../Providers/ThemeProvider';
import useSidePanels from '../../hooks/useSidePanels';
import { useSearchValue } from '../../state/search';
import { Box, Text } from '@chakra-ui/react';

type Props = { path: string };

const PathLabel = ({ children }: React.PropsWithChildren) => (
  <Text as="span" marginLeft="1rem" fontSize="0.8rem" color="lightgray">
    {children}
  </Text>
);

const HighlightedText = ({ children }: React.PropsWithChildren) => (
  <Text as="span" fontWeight="900" backgroundColor="rgba(255, 255, 255, 0.2)">
    {children}
  </Text>
);

export const FoundFile = (props: Props) => {
  const { path } = props;

  const { selectSidePanel } = useSidePanels();
  const term = useSearchValue();

  const fuzzyHighlight = (needle: string, path: string) => {
    const pathParts = path.split('/');
    const haystack = pathParts.pop() as string;
    const needleParts = [...needle];
    const haystackParts = [...haystack];

    if (haystack.includes(needle)) {
      const index = haystack.indexOf(needle);
      const split = [
        haystack.slice(0, Math.max(0, index - 1)),
        haystack.slice(index, needle.length),
        haystack.slice(index + needle.length, haystack.length),
      ];
      return [
        ...split.map((value, index) =>
          value === needle ? (
            <HighlightedText key={index}>{needle}</HighlightedText>
          ) : (
            <span key={index}>{value}</span>
          )
        ),

        <PathLabel key={split.length}>{pathParts.join('/')}</PathLabel>,
      ];
    }

    const parts = haystackParts.map((part, index) => {
      if (part === needleParts[0]) {
        needleParts.shift();
        return <HighlightedText key={index}>{part}</HighlightedText>;
      }

      return part;
    });

    return [
      <span key={0}>{parts}</span>,
      <PathLabel key={1}>{pathParts.join('/')}</PathLabel>,
    ];
  };

  return (
    <Box
      whiteSpace="nowrap"
      cursor="pointer"
      height="20px"
      onMouseDown={async () => {
        const dirPath = paths.dirname(path);
        fileTree.openDirectoryByPath(dirPath);

        selectSidePanel('Explorer');

        await refresh();
        // setTimeout(() => {
        setSelectedItem(path);
        // }, 200);
      }}
    >
      {fuzzyHighlight(term, path)}
    </Box>
  );
};
