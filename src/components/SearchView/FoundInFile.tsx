import * as React from 'react';
// import styled from 'styled-components';
import { FindInFilesResult } from './SearchView';
import { newId } from '../../utils/id';
import { Box, Text } from '@chakra-ui/react';
import useTextEditorTab from '../../hooks/useTextEditorTab';
import useTabs from '../../hooks/useTabs';

import * as paths from 'path';
import { fileTree, refresh, setSelectedItem } from '../../state/explorer';
import useSidePanels from '../../hooks/useSidePanels';
import TextEditorTab from '../../tabs/text_editor/text_editor';
import { SearchCursor } from '@codemirror/search';
import { EditorView } from '@codemirror/view';

type Props = { query: string; item: FindInFilesResult };

// const Row = styled.div`
//   text-indent: 1rem;
// `;

// const Highlight = styled.span`
//   font-weight: 900;
//   background-color: rgb(255 255 255 / 25%);
// `;

const Highlight = ({ children }: React.PropsWithChildren) => (
  <Text as="span" fontWeight="900" backgroundColor="rgb(255 255 255 / 25%)">
    {children}
  </Text>
);

export const FoundInFile = (props: Props) => {
  const { item, query } = props;

  const { pushTextEditorTab1 } = useTextEditorTab();
  const { viewsAndTabs, focusedView, selectTab } = useTabs();

  const { selectSidePanel } = useSidePanels();

  const open = (line: number) => {
    const { col, row } = focusedView;

    const tabs = viewsAndTabs[row].view_panels[col].tabs;

    for (const tab of tabs) {
      if (tab.path === item.path) {
        selectTab({ tab, col, row });

        const view = (tab as TextEditorTab).view;
        if (view) {
          const matches = new SearchCursor(view.state.doc, query);
          let selection = { from: 0, to: 0 };
          for (const match of matches) {
            if (line === view.state.doc.lineAt(match.from).number) {
              selection = match;
              break;
            }
          }

          view.dispatch({
            selection: { anchor: selection.to, head: selection.from },
            effects: EditorView.scrollIntoView(selection.from, {
              x: 'center',
              y: 'center',
            }),
          });
        }

        return;
      }
    }

    // Push the new tab
    pushTextEditorTab1(item.path, 'local', {
      find: { search: query, line },
    });
  };

  const highlight = (content: string) => {
    const index = content.indexOf(query);
    if (index === -1) {
      return [content];
    }
    return [
      content.substring(0, index),
      // <span className="highlight">{query}</span>,
      <Highlight key={newId()}>{query}</Highlight>,
      content.substring(index + query.length),
    ];
  };

  return (
    <Box whiteSpace="nowrap" cursor="pointer">
      <Box
        height="20px"
        onMouseDown={async () => {
          const dirPath = paths.dirname(item.path);
          fileTree.openDirectoryByPath(dirPath);

          selectSidePanel('Explorer');

          await refresh();
          setSelectedItem(item.path);

          open(item.rows[0].line);
        }}
      >
        <strong>{item.path.split('/').pop()}</strong>
      </Box>

      {item.rows.map(({ line, content }, index) => (
        <Box
          height="20px"
          textIndent="1rem"
          key={index}
          data-path="${path}"
          data-line="${line}"
          onMouseDown={async () => {
            const dirPath = paths.dirname(item.path);
            fileTree.openDirectoryByPath(dirPath);

            selectSidePanel('Explorer');

            await refresh();
            setSelectedItem(item.path);
            open(line);
          }}
        >
          {line}: {highlight(content)}
        </Box>
      ))}
    </Box>
  );
};
