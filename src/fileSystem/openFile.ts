export async function openFile() {
  const fileSystemFileHandles = await window.showOpenFilePicker();
  const fileSystemFileHandle = fileSystemFileHandles[0];
  const file = await fileSystemFileHandle.getFile();

  return file;
}
