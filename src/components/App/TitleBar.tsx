import { Flex, Image } from '@chakra-ui/react';
// import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
// import styled from 'styled-components';
import { isTauri } from '../../services/commands';
import { TitleMenuBar } from './TitleMenuBar';
// import LogoIcon from './LogoIcon';

// export const TitleBarContainer = styled.div`
//   background: ${({ theme }) => theme.elements.titleBar.background};
//   width: 100%;
//   max-height: 30px;
//   user-select: none;
//   display: flex;
//   justify-content: flex-end;

//   .window-controls {
//     width: 140px;
//     display: flex;
//     & path {
//       fill: ${({ theme }) => theme.elements.titleBar.controls.color} !important;
//     }

//     & button {
//       border: 0;
//       margin: 0;
//       flex: 1;
//       min-height: 33px;
//       outline: 0;
//       left: 0;
//       background: ${({ theme }) =>
//         theme.elements.titleBar.controls.background} !important;
//     }

//     & button:hover {
//       background: ${({ theme }) =>
//         theme.elements.titleBar.controls.hover.background} !important;
//     }

//     & button:nth-child(3):hover {
//       background: ${({ theme }) =>
//         theme.elements.titleBar.controls.hover.closeButton
//           .background} !important;
//     }

//     & button:nth-child(3):hover rect.fill {
//       fill: ${({ theme }) =>
//         theme.elements.titleBar.controls.hover.closeButton.color} !important;
//     }
//   }
// `;

// eslint-disable-next-line @typescript-eslint/ban-types
export const TitleBarContainer = (props: React.PropsWithChildren<{}>) => (
  <Flex w="full" maxH="30px" userSelect="none" align="center">
    {props.children}
  </Flex>
);
export default function TitleBar() {
  // const [appWindow, setAppWindow] = useState<null | WebviewWindow>(null);
  const [appWindow] = useState<any>(null);

  //   const { pushTextEditorTab2 } = useTextEditorTab();

  // Dinamically import the tauri API, but only when it's in a tauri window
  useEffect(() => {
    // if (isTauri) {
    //   import("@tauri-apps/api/window").then(({ appWindow }) => {
    //     setAppWindow(appWindow);
    //   });
    // }
  }, []);

  const minimizeWindow = () => {
    appWindow?.minimize();
  };

  const maximizeWindow = async () => {
    if (await appWindow?.isMaximized()) {
      appWindow?.unmaximize();
    } else {
      appWindow?.maximize();
    }
  };

  const closeWindow = () => {
    appWindow?.close();
  };

  return (
    <TitleBarContainer data-tauri-drag-region>
      {/* <LogoIcon
        src="./icons/monaco.svg"
        draggable={false}
        data-tauri-drag-region
      /> */}

      <Image
        width="40px"
        height="40px"
        src="./icons/monaco.svg"
        draggable={false}
        data-tauri-drag-region
        padding="6px"
      />
      <TitleMenuBar />
      {isTauri && (
        <div className="window-controls">
          <button onClick={minimizeWindow}>
            <ReactSVG src="/icons/minimize_window.svg" />
          </button>
          <button onClick={maximizeWindow}>
            <ReactSVG src="/icons/maximize_window.svg" />
          </button>
          <button onClick={closeWindow}>
            <ReactSVG src="/icons/close_window.svg" />
          </button>
        </div>
      )}
    </TitleBarContainer>
  );
}
