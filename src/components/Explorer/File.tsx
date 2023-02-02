import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import { useSetRecoilState } from 'recoil';
// import { useRecoilState } from 'recoil';

// import styled from 'styled-components';
import useContextMenu from '../../hooks/useContextMenu';
import useTabs from '../../hooks/useTabs';
import useTextEditorTab from '../../hooks/useTextEditorTab';

import { Entry } from '../../modules/fileTree';
import { Popup } from '../../modules/popup';
import { fileTree, refreshAll, useSelectedItem } from '../../state/explorer';
import { showedWindowsState } from '../../state/state';
import { darkTheme } from '../../themes/darkTheme';
import { incrementFileName } from '../../utils/incrementFileName';
// import { focusedViewPanelState } from '../../state/view';
// import { openedViewsAndTabs } from '../../state/views_tabs';

// import type { ThemeProps } from '../Providers/ThemeProvider';

// const FileContainer = styled.div<{ isSelected: boolean }>`
//   color: ${({ theme }: ThemeProps) => theme.elements.explorer.item.text.color};
//   white-space: nowrap;
//   display: flex;
//   cursor: pointer;
//   background-color: ${({ isSelected }) =>
//     isSelected ? 'rgba(255,255,255,0.2)' : 'transparent'};
// `;

type Props = { path: string; entry: Entry };

export const File = (props: Props) => {
  const { path, entry } = props;

  const selectedItem = useSelectedItem();
  const { pushTextEditorTab1 } = useTextEditorTab();
  const { viewsAndTabs, focusedView, selectTab } = useTabs();

  const { pushContextMenu } = useContextMenu();

  const setShowedWindows = useSetRecoilState(showedWindowsState);

  const open = () => {
    /* */

    const { col, row } = focusedView;

    const tabs = viewsAndTabs[row].view_panels[col].tabs;

    for (const tab of tabs) {
      if (tab.path === path) {
        selectTab({ tab, col, row });
        return;
      }
    }

    // Push the new tab
    pushTextEditorTab1(path, 'local');
  };

  // const copyFile = async () => {};

  function onContextMenu(ev: React.MouseEvent) {
    pushContextMenu({
      x: ev.pageX,
      y: ev.pageY,
      menus: [
        {
          label: {
            text: 'Open',
          },
          action() {
            open();
            return false;
          },
        },
        {
          label: {
            text: 'Copy File',
          },
          action() {
            const asyncAction = async () => {
              await fileTree.duplicateEntry(
                path,
                incrementFileName(path, false)
              );
              await refreshAll();
            };
            // fileTree
            //   .duplicateEntry(path, incrementFileName(path, false))
            //   .then(() => {
            //     refresh();
            //   });
            asyncAction();
            return false;
          },
        },
        {
          label: {
            text: 'CopyPath',
          },
          action() {
            navigator.clipboard.writeText(path);
            return false;
          },
        },
        {
          label: {
            text: 'Delete',
          },
          action() {
            const asyncAction = async () => {
              setShowedWindows((val) => [
                ...val,
                new Popup(
                  { text: '' },
                  { text: `Are you sure you want to delete ${path}?` },
                  [
                    {
                      label: {
                        text: 'Ok',
                      },
                      action: async () => {
                        await fileTree.deleteEntry(entry);
                        await refreshAll();
                      },
                    },
                    {
                      label: {
                        text: 'Cancel',
                      },
                      action: () => {
                        /**/
                      },
                    },
                  ],
                  200,
                  500
                ),
              ]);
              // await fileTree.deleteEntry(entry);
              // await refresh();
            };
            asyncAction();
            return false;
          },
        },
      ],
    });
  }

  const name = path.split('/').pop();
  const indent = path.split('/').length ?? 0;

  return (
    <Flex
      color={darkTheme.explorer.item.text.color}
      whiteSpace="nowrap"
      height="24px"
      align="center"
      cursor="pointer"
      backgroundColor={
        path === selectedItem
          ? darkTheme.explorer.item.selected.background
          : 'transparent'
      }
      style={{ textIndent: `${indent}rem` }}
      onContextMenu={onContextMenu}
      onClick={open}
      _hover={{ backgroundColor: darkTheme.explorer.item.hover.background }}
    >
      {name}
    </Flex>
  );

  // return (
  //   <FileContainer
  //     isSelected={path === selectedItem}
  //     style={{ textIndent: `${indent}rem` }}
  //     className={`file ${path === selectedItem ? 'selected' : ''}`}
  //     onContextMenu={onContextMenu}
  //     onClick={open}
  //   >
  //     {name}
  //   </FileContainer>
  // );
};
