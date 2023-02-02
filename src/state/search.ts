import {
  atom,
  //   useAtom,
  useAtomWithSelector,
} from '@ishikawa-masashi/react-atomic-state';
import { FindInFilesResult } from '../components/SearchView';

import { Entry } from '../modules/fileTree';

enum SearchType {
  Files = 'files',
  InFiles = 'in-files',
}
type SearchState = {
  searchType: SearchType;
  searchValue: string;
  foundFiles: Entry[];
  foundInFiles: FindInFilesResult[];
};

const searchState = atom<SearchState>({
  searchType: SearchType.Files,
  searchValue: '',
  foundFiles: [],
  foundInFiles: [],
});

export const setSearchValue = (searchValue: string) =>
  searchState.set((state) => ({ ...state, searchValue }));

export const setSearchType = (searchType: SearchType) =>
  searchState.set((state) => ({ ...state, searchType }));

export const setFoundFiles = (foundFiles: Entry[]) =>
  searchState.set((state) => ({ ...state, foundFiles }));

export const setFoundInFiles = (foundInFiles: FindInFilesResult[]) =>
  searchState.set((state) => ({ ...state, foundInFiles }));

export const useSearchValue = () =>
  useAtomWithSelector(searchState, (state) => state.searchValue);

export const useSearchType = () =>
  useAtomWithSelector(searchState, (state) => state.searchType);

export const useFoundFiles = () =>
  useAtomWithSelector(searchState, (state) => state.foundFiles);

export const useFoundInFiles = () =>
  useAtomWithSelector(searchState, (state) => state.foundInFiles);
