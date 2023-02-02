import {
  atom,
  useAtom,
  useAtomWithSelector,
} from '@ishikawa-masashi/react-atomic-state';

import { FileTree, Entry } from '../modules/fileTree';

export type List = { path: string; entry: Entry }[];

export type FileContextMenuProps = { x: number; y: number; path: string };
export type DirectoryContextMenuProps = { x: number; y: number };

type ExplorerState = {
  list: List;
  selectedItem: string;
  fileContextMenuProps?: FileContextMenuProps;
};

export const fileTree = new FileTree();

const count = atom(0);

const explorerState = atom<ExplorerState>({
  list: [],
  selectedItem: '',
  fileContextMenuProps: undefined,
});

export const setList = (list: List) =>
  explorerState.set((state) => ({ ...state, list }));

export const setSelectedItem = (selectedItem: string) =>
  explorerState.set((state) => ({ ...state, selectedItem }));

export const setFileContextMenu = (
  fileContextMenuProps?: FileContextMenuProps
) =>
  explorerState.set((state) => ({
    ...state,
    fileContextMenuProps,
  }));

// const unsubscribe = explorerState.subscribe((value) => {
//   // console.log(value); // log every update
// });

// create a custom hook
export const useCount = () => useAtom(count);

// create a custom hook with selector
export const useStringCount = () =>
  useAtomWithSelector(count, (count) => count.toString());

export const useList = () =>
  useAtomWithSelector(explorerState, (state) => state.list);

export const useSelectedItem = () =>
  useAtomWithSelector(explorerState, (state) => state.selectedItem);

export const useFileContextMenuProps = () =>
  useAtomWithSelector(explorerState, (state) => state.fileContextMenuProps);

export const openDirectory = async () => {
  await fileTree.openDirectory();
  const directory = fileTree.currentDirectory;
  if (directory) {
    const list: List = [];
    fileTree.list(directory, list);
    setList(list);
  }
};

export const toggleDirectory = (path: string) => {
  fileTree.toggleDirectory(path);
  const directory = fileTree.currentDirectory;
  if (directory) {
    const list: List = [];
    fileTree.list(directory, list);
    setList(list);
  }
};

export const refresh = async () => {
  // const dirHandle = fileTree.currentDirectoryHandle;
  // await fileTree.browseDirectory(dirHandle);
  const directory = fileTree.currentDirectory;
  if (directory) {
    const list: List = [];
    fileTree.list(directory, list);
    setList(list);
  }
};

export const refreshAll = async () => {
  // const dirHandle = fileTree.currentDirectoryHandle;
  // await fileTree.browseDirectory(dirHandle);
  const directory = fileTree.currentDirectory;
  if (directory) {
    const list: List = [];
    fileTree.list(directory, list);
    setList(list);
  }
};
