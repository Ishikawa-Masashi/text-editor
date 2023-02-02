import * as React from 'react';
import { fileTree, useList, useSelectedItem } from '../../state/explorer';
import { VerticalList } from '../VerticalList';
import { File } from './File';
import { Directory } from './Directory';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { Box } from '@chakra-ui/react';
// import { darkTheme } from '../../themes/darkTheme';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const Explorer = () => {
  const list = useList();

  // const fileContextMenuProps = useFileContextMenuProps();
  const selectedItem = useSelectedItem();
  const ref = React.useRef(null);
  const [width, height] = useResizeObserver(ref);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        whiteSpace="nowrap"
        // backgroundColor={darkTheme.sideBarSectionHeader.background}
        fontWeight="bold"
      >
        {fileTree.currentDirectory ? (
          <ChevronDownIcon width="24px" height="24px" />
        ) : (
          <ChevronRightIcon width="24px" height="24px" />
        )}
        {fileTree.currentDirectory
          ? fileTree.currentDirectoryHandle.name
          : 'NO FOLDER OPENED'}
      </Box>
      <Box
        ref={ref}
        width="full"
        height="calc(100% - 69px)"
        // bgColor={darkTheme.sideBar.background}
      >
        <VerticalList
          list={list}
          width={width}
          height={height}
          estimateSize={() => 24}
          index={list.findIndex((value) => value.path === selectedItem)}
          renderItem={(item) => {
            return item.entry.handle.kind === 'directory' ? (
              <Directory {...item} />
            ) : (
              <File {...item} />
            );
          }}
        />
        {/* {fileContextMenuProps && <FileContextMenu {...fileContextMenuProps} />} */}
      </Box>
    </>
  );
};
