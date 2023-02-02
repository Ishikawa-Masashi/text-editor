import { Box, Flex, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import * as React from 'react';
// import styled from 'styled-components';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { fileTree } from '../../state/explorer';
import {
  setFoundFiles,
  setFoundInFiles,
  setSearchType,
  setSearchValue,
  useFoundFiles,
  useFoundInFiles,
  useSearchType,
  useSearchValue,
} from '../../state/search';
import { VerticalList } from '../VerticalList';
import { FoundFile } from './FoundFile';
import { FoundInFile } from './FoundInFile';

export type FindInFilesResult = {
  path: string;
  rows: {
    line: number;
    content: string;
  }[];
};

enum SearchType {
  Files = 'files',
  InFiles = 'in-files',
}

export const SearchView = () => {
  const resultsListRef = React.useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserver(resultsListRef);

  const searchValue = useSearchValue();
  const searchType = useSearchType();
  const foundFiles = useFoundFiles();
  const foundInFiles = useFoundInFiles();

  const search = React.useCallback(
    async (searchType: SearchType, searchValue: string) => {
      const term = searchValue;
      if (!term) {
        if (searchType === SearchType.Files) {
          setFoundFiles([]);
          return;
        }
        setFoundInFiles([]);
        return;
      }

      if (term.trim() !== '') {
        if (searchType === SearchType.Files) {
          const { results } = fileTree.findFile(term);
          setFoundFiles(results);
          return;
        }

        const { results } = await fileTree.findInFiles(term);
        setFoundInFiles(results);
      }
    },
    [setFoundFiles, setFoundInFiles]
  );

  //   const debounce = (func: () => void, delay: number, immediate = false) => {
  //     let timeout: number | undefined;

  //     return () => {
  //       const later = () => {
  //         timeout = undefined;
  //         if (!immediate) {
  //           func();
  //         }
  //       };

  //       const callNow = immediate && !timeout;

  //       clearTimeout(timeout);
  //       timeout = window.setTimeout(later, delay);

  //       if (callNow) {
  //         func();
  //       }
  //     };
  //   };

  //   const debouncedSearch = debounce(search, 500);

  React.useEffect(() => {
    // debouncedSearch();
    setTimeout(() => {
      search(searchType, searchValue);
    }, 500);
  }, [searchValue, searchType, search]);

  return (
    <Box width="100%" height="100%" padding="6px">
      <Flex direction="column" id="search-type">
        <RadioGroup
          onChange={(nextValue) => {
            setSearchType(nextValue as SearchType);
          }}
          defaultValue={searchType}
        >
          <Stack direction="column">
            <Radio value={SearchType.Files}>Search files</Radio>
            <Radio value={SearchType.InFiles}>Search in files</Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      <Input
        defaultValue={searchValue}
        onChange={(ev) => {
          setSearchValue(ev.target.value);
        }}
        placeholder="Search"
      />
      <Box width="100%" height="calc(100% - 96px)" ref={resultsListRef}>
        {searchType === SearchType.Files
          ? foundFiles && (
              <VerticalList
                width={width}
                height={height}
                list={foundFiles}
                estimateSize={() => 24}
                renderItem={(item) => <FoundFile path={item.path} />}
              />
            )
          : foundInFiles && (
              <VerticalList
                width={width}
                height={height}
                list={foundInFiles}
                renderItem={(item) => (
                  <FoundInFile query={searchValue} item={item} />
                )}
                estimateSize={(index) =>
                  (foundInFiles[index ?? 0].rows.length + 1) * 20
                }
              />
            )}
      </Box>
    </Box>
  );
};
