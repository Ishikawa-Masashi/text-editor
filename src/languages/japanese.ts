export const JapaneseLanguage = {
  code: 'ja',
  translation: {
    messages: {
      PickAShell: 'Pick a Shell',
      NoTabsOpenedMessage: "Tip: Open the Global Prompt with '{{hotkey}}'",
      LoadingContent: 'Loading content...',
    },
    popups: {
      AskSaveFile: {
        title: 'Do you want to save the changes in {{file_path}} ?',
        content: 'Important changes might be lost if you decline.',
      },
    },
    tabs: {
      Welcome: {
        title: 'Welcome',
        content:
          'You are currently using a pre-alpha version of モナカエディタ, expect bugs or uncompleted features.',
      },
    },
    prompts: {
      NoResults: 'No results were found',
      Global: {
        OpenWelcome: 'Open Welcome',
        OpenSettings: 'Open Settings',
        OpenFolder: 'Open Folder',
        AddFolder: 'Add Folder',
        OpenFile: 'Open File',
        OpenTerminal: 'Open Terminal',
      },
    },
    contextMenus: {
      panels: {
        SplitHorizontally: 'Split horizontally',
        SplitVertically: 'Split vertically',
      },
    },
    notifications: {
      EditorCompatibleNotFound: 'Compatible editor not found',
      ErrorWhileReadingFile: 'Error while reading {{file}}',
      UnknownError: 'Unknown error',
      TerminalShellUnstable: {
        title: 'Unstable feature',
        content: 'Terminals are still very unstable. Proceed with caution.',
      },
    },
    Editor: 'モナカエディタ',
    Contribute: 'Contribute',
    'Report issues': 'Report issues',
    Save: 'Save',
    "Don't save": "Don't save",
    Cancel: 'Cancel',
    Close: 'Close',
    License: 'License',
    Dismiss: 'Dismiss',
    CopyPath: 'Copy Path',
    Open: 'Open',
  },
};
