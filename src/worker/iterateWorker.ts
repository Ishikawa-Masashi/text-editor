//language=JavaScript
export const _worker: Worker = self as any;

self.addEventListener('message', async ({ data }) => {
  const { handle, dir, includeFileContent, ignoredDirectories, filesToIndex } =
    data;

  const currentDirectory = await iterateFiles(
    handle,
    dir,
    includeFileContent,
    ignoredDirectories,
    filesToIndex
  );
  currentDirectory.indexed = true;

  postMessage(currentDirectory);
});

const iterateFiles = async (
  directoryHandle: FileSystemDirectoryHandle,
  dir = {} as any,
  includeFileContent = false,
  ignoredDirectories: string[] = [],
  filesToIndex: string[] = []
) => {
  for await (const [name, handle] of directoryHandle.entries()) {
    const path = dir.path + '/' + name;
    if (handle.kind === 'file') {
      dir.entries[path] = {
        path,
        handle,
        parentHandle: directoryHandle,
      };
      if (includeFileContent) {
        const fileName = path.split('/').pop() as string;
        const extension = fileName.split('.').pop() as string;
        const shouldReadFile = filesToIndex.includes(extension);

        const file = shouldReadFile ? await handle.getFile() : null;

        dir.entries[path].fileContent = shouldReadFile
          ? await file?.text()
          : '';
      }
    } else {
      dir.entries[path] = {
        path,
        handle,
        parentHandle: directoryHandle,
        entries: {},
      };

      if (!ignoredDirectories.includes(name)) {
        await iterateFiles(
          handle,
          dir.entries[path],
          includeFileContent,
          ignoredDirectories,
          filesToIndex
        );
      }
    }
  }

  dir.hasFileContent = includeFileContent;

  return dir;
};
