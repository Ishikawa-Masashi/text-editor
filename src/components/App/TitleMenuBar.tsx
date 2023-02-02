import * as React from 'react';

import { MenuBar, MenuItem, Menu } from '../MenuBar';

import { openFile } from '../../fileSystem/openFile';
import useTextEditorTab from '../../hooks/useTextEditorTab';
import { openDirectory } from '../../state/explorer';

export function TitleMenuBar() {
  const { pushTextEditorTab2 } = useTextEditorTab();

  function onSelect(command: string) {
    console.log('Selected command: %s', command);
    switch (command) {
      case 'open-file':
        {
          const callback = async () => {
            try {
              const openedFile = await openFile();
              if (openedFile) {
                pushTextEditorTab2(openedFile.name, await openedFile.text());
              }
            } catch (e) {
              console.log(e);
            }
          };
          callback();
        }
        break;
      case 'open-folder':
        openDirectory();
        break;
      default:
        break;
    }
  }

  return (
    <MenuBar onSelect={onSelect}>
      <MenuItem label="File">
        <Menu>
          <MenuItem command="open-file">Open File</MenuItem>
          <MenuItem command="open-folder">Open Folder</MenuItem>
          {/* <MenuItem
            command="new-window"
            shortcut={'Ctrl+N Ctrl+N'}
            icon={<div>×</div>}
          >
            New Window
          </MenuItem>
          <MenuItem command="new-file">New File</MenuItem> */}
        </Menu>
      </MenuItem>

      {/* <MenuItem label="Edit">
        <Menu>
          <MenuItem command="undo">Undo</MenuItem>
          <MenuItem command="redo">Redo</MenuItem>
          <Separator />
          <MenuItem label="Find">
            <Menu>
              <MenuItem command="find">Find…</MenuItem>
              <MenuItem command="find-next">Find Next</MenuItem>
              <MenuItem command="find-previous">Find Previous</MenuItem>
              <MenuItem command="use-selection-for-find">
                Use Selection For Find
              </MenuItem>
            </Menu>
          </MenuItem>
        </Menu>
      </MenuItem>

      <MenuItem label="Format">
        <Menu>
          <MenuItem command="undo" icon={<div>×</div>}>
            Undo
          </MenuItem>
          <MenuItem command="redo">Redo</MenuItem>
          <Separator />
          <MenuItem label="Find">
            <Menu>
              <MenuItem command="find">Find…</MenuItem>
              <MenuItem command="find-next">Find Next</MenuItem>
              <MenuItem command="find-previous">Find Previous</MenuItem>
              <MenuItem command="use-selection-for-find">
                Use Selection For Find
              </MenuItem>
            </Menu>
          </MenuItem>
        </Menu>
      </MenuItem>
      <MenuItem key="help" label="Help">
        <Menu>
          <MenuItem command="terms-of-use">Terms of Use</MenuItem>
          <MenuItem command="documentation">Documentation</MenuItem>
          <Separator />
          <MenuItem command="release-notes">Release Notes</MenuItem>
        </Menu>
      </MenuItem> */}
    </MenuBar>
  );
}
