import TextEditor from '../../components/TextEditor/TextEditor';
import { clientState } from '../../state/state';
import { getRecoil } from 'recoil-nexus';
import { FileFormat } from '../../services/clients/client.types';
import { Popup } from '../../modules/popup';
import * as commands from '@codemirror/commands';
import {
  SaveTabOptions,
  Tab,
  TabContextMenuHooks,
  TextEditorTabData,
} from '../../modules/tab';
import { rust } from '@codemirror/lang-rust';
// import { dirname } from "path";
import { useEffect, useState } from 'react';
import TabText from '../../components/Tabs/TabText';
import LoadingTabContent from '../../components/Tabs/LoadingTabContent';
import FileIcon from '../../components/Filesystem/FileIcon';
import useLSPClients from '../../hooks/useLSPClients';
import { useTranslation } from 'react-i18next';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  KeyBinding,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { EditorState, StateCommand } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { useRecoilValue } from 'recoil';
import { fileTree } from '../../state/explorer';
// import { LanguageServerClient } from "codemirror-languageserver";
// import GravitonTransport from "./graviton_lsp_transport";
// import { basename } from "../../utils/path";

export interface SavedState {
  scrollHeight: number;
  find: { search: string; line: number };
}

/**
 * A tab that displays a CodeMirror editor inside it
 */
class TextEditorTab extends Tab {
  public state: SavedState = {
    scrollHeight: 0,
    find: { search: '', line: 0 },
  };
  public path: string;
  public filename: string;
  public format: FileFormat;
  public lastSavedStateText: string[] = [];
  public view?: EditorView;
  public contentResolver: Promise<string | null>;

  /**
   * @param path - Path of the opened file
   * @param initialContent - Current content of the file
   */
  constructor(
    filename: string,
    path: string,
    contentResolver: Promise<string | null>,
    format: FileFormat
  ) {
    super(filename);
    this.path = path;
    this.hint = path;
    this.filename = filename;
    this.format = format;
    this.contentResolver = contentResolver;
  }

  public container = TabTextEditorContainer;

  public icon({ tab }: { tab: Tab }) {
    const textEditorTab = tab as unknown as TextEditorTab;
    return (
      <FileIcon
        isOpened={false}
        item={{
          isFile: true,
          name: textEditorTab.filename,
        }}
      />
    );
  }

  contextMenusTab({ tab }: TabContextMenuHooks) {
    const textEditorTab = tab as unknown as TextEditorTab;
    return [
      {
        label: {
          text: 'CopyPath',
        },
        action() {
          navigator.clipboard.writeText(textEditorTab.path);
          return false;
        },
      },
    ];
  }

  /**
   * Destroy the CodeMirror view
   */
  public close(): void {
    this.view?.destroy();
    return;
  }

  /**
   * Only open text files
   * @param format - The requested file's format
   */
  static isCompatible(format: FileFormat) {
    return format !== 'Binary';
  }

  /**
   * Shortcut to update the tab's state
   * @param state - Wether the editor is edited or not
   */
  public setEdited(state: boolean) {
    this.edited = state;
  }

  /**
   * Get the content of the Codemirror state as a String
   * @returns The current content on the editor
   */
  public getContent(): string | null {
    if (this.view) return this.view.state.doc.sliceString(0);
    return null;
  }

  /**
   * Save the tab
   *
   * @param options - Different options to tweak the saving behavior
   */
  public save({ force, close, setEdited }: SaveTabOptions): Popup | null {
    const safeSave = () => {
      this.saveFile();
      const [, file] = fileTree.findEntry(this.path);

      if (file) {
        fileTree.saveFile(
          this.getContent() ?? '',
          file.handle as FileSystemFileHandle
        );
      }

      // Mark the tab as saved
      setEdited(false);
    };

    if (force === true) {
      safeSave();
    } else if (this.edited) {
      return new Popup(
        {
          text: 'popups.AskSaveFile.title',
          props: { file_path: this.filename },
        },
        {
          text: 'popups.AskSaveFile.content',
        },
        [
          {
            label: {
              text: 'Save',
            },
            action: () => safeSave(),
          },
          {
            label: {
              text: "Don't save",
            },
            action: () => {
              // User decided to not save the file, therefore close it
              close();
            },
          },
          {
            label: {
              text: 'Cancel',
            },
            action: () => undefined,
          },
        ],
        200
      );
    }
    return null;
  }

  /**
   * Write the file to the FS
   */
  private async saveFile() {
    const currentContent = this.getContent();

    // Make sure the file is loaded and has content
    if (this.view && currentContent != null) {
      const client = getRecoil(clientState);

      // Save the file
      await client.write_file_by_path(this.path, currentContent, 'local');

      // Update the last saved state text
      this.lastSavedStateText = this.view.state.doc.toJSON();
    }
  }

  public toJson(): TextEditorTabData {
    return {
      tab_type: 'TextEditor',
      path: this.path,
      filesystem: 'local',
      format: this.format,
      filename: this.filename,
      id: this.id,
    };
  }
}

function TabTextEditorContainer({
  close,
  setEdited,
  tab,
}: {
  close: () => void;
  setEdited: (state: boolean) => void;
  tab: Tab;
}) {
  const textEditorTab = tab as unknown as TextEditorTab;

  const [view, setView] = useState(textEditorTab.view);
  // const { find, add } = useLSPClients();
  const { find } = useLSPClients();
  const { t } = useTranslation();
  const client = useRecoilValue(clientState);

  useEffect(() => {
    if (view != null) return;

    // Wait until the tab is mounted to read it's content
    textEditorTab.contentResolver.then((initialValue) => {
      if (initialValue != null) {
        createDefaulState(initialValue).then((state) => {
          textEditorTab.view = new EditorView({
            state,
            dispatch: (tx) => {
              if (tx.docChanged) setEdited(true);
              (textEditorTab.view as EditorView).update([tx]);
            },
          });

          // Update the view component
          setView(textEditorTab.view);
        });
      } else {
        // If there is no content to read then just close the tab
        textEditorTab.close();
        close();
      }
    });

    function getKeymap() {
      // Undo command
      const undo: StateCommand = (target) => {
        commands.undo(target);
        return checkEditStatus(target);
      };

      // Redo command
      const redo: StateCommand = (target) => {
        commands.redo(target);
        return checkEditStatus(target);
      };

      // If the new state doc is the same as the last saved one then set the tab as unedited
      const checkEditStatus: StateCommand = (target) => {
        const currentStateText = target.state.doc.toJSON();

        if (
          textEditorTab.lastSavedStateText.length == currentStateText.length &&
          textEditorTab.lastSavedStateText.every(
            (e, i) => e == currentStateText[i]
          )
        ) {
          setEdited(false);
        } else {
          setEdited(true);
        }

        return false;
      };

      // Define the custom keymap
      const customKeymap: readonly KeyBinding[] = [
        { key: 'mod-y', run: redo, preventDefault: true },
        { key: 'mod-z', run: undo, preventDefault: true },
      ];

      return keymap.of(customKeymap);
    }

    // Initialize the CodeMirror State
    async function createDefaulState(
      initialValue: string
    ): Promise<EditorState> {
      const extensions = [
        getKeymap(),
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
      ];
      let lspLanguage: [string, string] | null = null;

      if (textEditorTab.filename) {
        const ext = textEditorTab.filename.split('.').pop();
        switch (ext) {
          case 'js':
            extensions.push(javascript());
            break;

          case 'html':
            extensions.push(html());
            break;
          default:
            break;
        }
      }

      if (typeof textEditorTab.format !== 'string') {
        switch (textEditorTab.format.Text) {
          case 'TypeScript':
            lspLanguage = ['typescript', textEditorTab.format.Text];
            extensions.push(javascript());
            break;
          case 'JavaScript':
            lspLanguage = ['javascript', textEditorTab.format.Text];
            extensions.push(javascript());
            break;
          case 'Rust':
            lspLanguage = ['rust', textEditorTab.format.Text];
            extensions.push(rust());
            break;
          default:
            lspLanguage = null;
        }
      }

      // TODO(marc2332): Remove *somehow* the client if the language server is disabled/closed

      // Use the first language server builder found
      if (lspLanguage != null) {
        const [languageId] = lspLanguage;

        // const unixPath = textEditorTab.path.replace(/\\/g, "/");
        // const rootUri = `file:///${dirname(unixPath)}`;

        const loadedLsClient = find(languageId);

        if (loadedLsClient) {
          // Reuse existing lsp clients
          // const lsPlugin = languageServerWithClient({
          //   languageId,
          //   documentUri: `file:///${unixPath}`,
          //   client: loadedLsClient,
          // });
          // extensions.push(lsPlugin);
        } else {
          const available_language_servers =
            await client.get_all_language_server_builders();

          if (available_language_servers.Ok) {
            const lang_servers = available_language_servers.Ok;

            for (const lang_server of lang_servers) {
              if (lang_server.id === languageId) {
                // Initialize a language server
                client.create_language_server(languageId);

                // Create a client
                // const lsClient = new LanguageServerClient({
                //   transport: new GravitonTransport(languageId, client),
                //   rootUri,
                //   workspaceFolders: [
                //     {
                //       name: basename(dirname(unixPath)),
                //       uri: unixPath,
                //     },
                //   ],
                // });

                // Create a plugin
                // const lsPlugin = languageServerWithClient({
                //   languageId,
                //   documentUri: `file:///${unixPath}`,
                //   client: lsClient,
                // });

                // Save the client to re use for other editors
                // add(
                //   rootUri,
                //   languageId,
                //   client: lsClient,
                // });

                // extensions.push(lsPlugin);
              }
            }
          }
        }
      }

      const state = EditorState.create({
        extensions,
        doc: initialValue,
      });

      // Leave the just created state as the latest one saved
      textEditorTab.lastSavedStateText = state.doc.toJSON();

      return state;
    }
  }, [view]);

  const saveScroll = (height: number) => {
    textEditorTab.state.scrollHeight = height;
  };

  if (view) {
    return (
      <TextEditor
        view={view}
        scrollHeight={textEditorTab.state.scrollHeight}
        saveScroll={saveScroll}
        state={textEditorTab.state}
      />
    );
  } else {
    return (
      <LoadingTabContent>
        <TabText>{t('messages.LoadingContent')}</TabText>
      </LoadingTabContent>
    );
  }
}

export default TextEditorTab;
