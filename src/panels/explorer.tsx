// import { atom } from 'recoil';
// import { TreeItem } from '../components/Filesystem/FilesystemExplorer';
import { SidePanel } from '../modules/side_panel';
// import { foldersState } from '../state/state';
// import useTabs from '../hooks/useTabs';
// import { SecondaryButton } from '../components/Primitive/Button';
// import { openFileSystemPicker } from '../services/commands';
// import HorizontalCentered from '../components/Primitive/HorizontalCentered';
// import SettingsTab from '../tabs/settings';
// import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
// import useTextEditorTab from '../hooks/useTextEditorTab';
import { Explorer } from '../components/Explorer/Explorer';
// import { openDirectory } from '../state/explorer';
import { FilesIcon } from '../components/Icons';
import { Text } from '@chakra-ui/react';

const StyledExplorer = styled.div`
  height: 100%;
  padding-left: 5px;
`;

interface ExplorerPanelOptions {
  onFocus: (callback: () => void) => void;
}

// const explorerState = atom<TreeItem>({
//   key: 'explorerState',
//   dangerouslyAllowMutability: true,
//   default: {
//     name: '/',
//     isFile: false,
//     items: {},
//   },
// });

function ExplorerPanelContainer({ onFocus }: ExplorerPanelOptions) {
  //   const [folders] = useRecoilState(foldersState);
  //   const { openTab } = useTabs();
  //   const { t } = useTranslation();
  const refExplorer = useRef<HTMLButtonElement>(null);
  //   const { pushTextEditorTab } = useTextEditorTab();
  //   const [tree, setTree] = useRecoilState(explorerState);

  useEffect(() => {
    onFocus(() => {
      refExplorer.current?.focus();
    });
  }, []);

  //   async function openFile(item: TreeItemInfo) {
  //     if (item.isFile) {
  //       pushTextEditorTab(item.path, item.filesystem);
  //     }
  //   }

  // async function openFolder() {
  //   const openedFolder = await openFileSystemPicker('local', 'folder');
  //   // If a folder selected
  //   if (openedFolder != null) {
  //     // Clear all opened folders and open the selected one
  //     setOpenedFolders([
  //       {
  //         path: openedFolder,
  //         filesystem: 'local',
  //       },
  //     ]);
  //   }
  // }

  //   function openSettings() {
  //     openTab(new SettingsTab());
  //   }

  return (
    <StyledExplorer>
      <Text color="white">EXPLORER</Text>
      {/* {folders.length === 0 ? ( */}
      <Explorer />
      {/* ) : (
        <FilesystemExplorer
          folders={folders}
          onSelected={openFile}
          tree={tree}
          saveTree={(tree) => setTree(tree)}
        />
      )} */}
    </StyledExplorer>
  );
}

/**
 * Built-in panel that displays a filesystem explorer
 */
export default class ExplorerPanel extends SidePanel {
  private callback = () => {
    /**/
  };

  constructor() {
    super('Explorer');
    this.icon = () => <FilesIcon fill="white" width="36px" height="36px" />;
    this.container = () => (
      <ExplorerPanelContainer onFocus={(c) => (this.callback = c)} />
    );
  }

  public focus() {
    this.callback();
  }
}
