import { useRecoilValue } from 'recoil';
import { clientState } from '../state/state';
import useEditor from './useEditor';
import useNotifications from './useNotifications';
import useTabs from './useTabs';
import { Notification } from '../modules/notification';
import { basename } from '../utils/path';
import { fileTree } from '../state/explorer';

export default function useTextEditorTab() {
  const client = useRecoilValue(clientState);
  const { openTab } = useTabs();
  const getEditor = useEditor();
  const { pushNotification } = useNotifications();

  return {
    pushTextEditorTab(path: string, filesystem: string) {
      const name = basename(path);
      try {
        client.read_file_by_path(path, filesystem).then((fileContent) => {
          if (fileContent.Ok) {
            const { content, format } = fileContent.Ok;
            const editor = getEditor(format);
            // Make sure a compatible editor was found
            if (editor != null) {
              const newTab = new editor(
                name,
                path,
                Promise.resolve(content),
                format
              );
              openTab(newTab);
            } else {
              pushNotification(
                new Notification(
                  {
                    text: 'notifications.EditorCompatibleNotFound',
                  },
                  { text: '' }
                )
              );
            }
          } else {
            // TODO(marc2332) Use the notification content to properly show the error
            pushNotification(
              new Notification(
                {
                  text: 'notifications.ErrorWhileReadingFile',
                  props: { file: name },
                },
                { text: '' }
              )
            );
            console.log(fileContent.Err);
          }
        });
      } catch (err) {
        pushNotification(
          new Notification(
            { text: 'notifications.UnknownError' },
            {
              text: '',
            }
          )
        );
        console.log(err);
      }
    },

    pushTextEditorTab1(
      path: string,
      filesystem: string,
      option?: { find: { search: string; line: number } }
    ) {
      fileTree.openFileByPath(path).then((value) => {
        const name = basename(path);
        const fileContent = {
          Ok: {
            content: value?.contents as string,
            format: { Text: 'txt' },
          },
        };
        if (filesystem) {
          console.log(filesystem);
        }
        try {
          if (fileContent.Ok) {
            const { content, format } = fileContent.Ok;
            const editor = getEditor(format);
            // Make sure a compatible editor was found
            if (editor != null) {
              const newTab = new editor(
                name,
                path,
                new Promise((resolve) => resolve(content)),
                format
              );

              if (option?.find) {
                newTab.state.find.search = option.find.search;
                newTab.state.find.line = option.find.line;
              } else {
                newTab.state.find.search = '';
                newTab.state.find.line = -1;
              }

              openTab(newTab);
            } else {
              pushNotification(
                new Notification(
                  {
                    text: 'notifications.EditorCompatibleNotFound',
                  },
                  { text: '' }
                )
              );
            }
          } else {
            // TODO(marc2332) Use the notification content to properly show the error
            pushNotification(
              new Notification(
                {
                  text: 'notifications.ErrorWhileReadingFile',
                  props: { file: name },
                },
                { text: '' }
              )
            );
            // console.log(fileContent.Err);
          }
        } catch (err) {
          pushNotification(
            new Notification(
              { text: 'notifications.UnknownError' },
              {
                text: '',
              }
            )
          );
          console.log(err);
        }
      });
    },

    pushTextEditorTab2(path: string, content: string) {
      const name = basename(path);
      try {
        const format = { Text: 'txt' };
        const editor = getEditor(format);
        // Make sure a compatible editor was found
        if (editor != null) {
          const newTab = new editor(
            name,
            path,
            new Promise((resolve) => resolve(content)),
            format
          );
          openTab(newTab);
        } else {
          pushNotification(
            new Notification(
              {
                text: 'notifications.EditorCompatibleNotFound',
              },
              { text: '' }
            )
          );
        }
      } catch (err) {
        pushNotification(
          new Notification(
            { text: 'notifications.UnknownError' },
            {
              text: '',
            }
          )
        );
        console.log(err);
      }
    },
  };
}
