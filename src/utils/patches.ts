export default function applyPatches() {
  /**
   * Disable the print prompt
   */
  window.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey || event.shiftKey) &&
        (event.key === 'p' ||
          event.key === 'k' ||
          event.key === 'l' ||
          event.key === 's')
      ) {
        event.preventDefault();
      }
    },
    true
  );

  /**
   * Disable the browser's context menu
   */
  window.addEventListener(
    'contextmenu',
    (event: MouseEvent) => {
      event.preventDefault();
    },
    true
  );

  // first, inhibit the default behaviour throughout the window
  window.addEventListener('drop', (event) => {
    event.preventDefault();
  });

  window.addEventListener('dragover', (event) => {
    // event.dataTransfer.dropEffect = 'none'; // dont allow drops
    event.preventDefault();
  });

  // window.addEventListener(
  //   'drop',
  //   (ev) => {
  //     ev.preventDefault();

  //     const file = ev.dataTransfer?.files[0];
  //     const reader = new FileReader();
  //     reader.onload = function (event) {
  //       console.log(event.target);
  //       // if (file?.name && event.target?.result) {
  //       //   pushTextEditorTab2(file?.name ?? '', event.target.result as string);
  //       // }
  //     };
  //     console.log(file);
  //     if (file) {
  //       reader.readAsText(file);
  //     }

  //     return false;
  //   },
  //   true
  // );
}
