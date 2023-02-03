import { useEffect } from 'react';
// import { createClient } from "../../services/client";
import { clientState, promptsState } from '../../state/state';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import SidePanelsView from './SidePanelsView';
import ViewsView from './ViewsView';
import Theme from '../Providers/ThemeProvider';
// import { isTauri } from "../../services/commands";
import ExplorerPanel from '../../panels/explorer';
import StatusBarView from './StatusBarView';
import GlobalPrompt from '../../prompts/global';
import TitleBar from './TitleBar';
import ContextMenuView from './ContextMenuView';
import WindowsView from './WindowsView';
import { RootView } from './RootView';
import Commands from './Commands';
import useSidePanels from '../../hooks/useSidePanels';
import NotificationsView from './NotificationsView';
// import GitPanel from '../../panels/git/git';
import FakeClient from '../../services/clients/fake_client';
import SerachPanel from '../../panels/search/search';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SplitPane } from '../SplitPane';

/*
 * Retrieve the authentication token
 */
// async function getToken() {
//   if (isTauri) {
//     return "graviton_token";
//   } else {
//     // Or query the URL to get the token
//     return new URL(location.toString()).searchParams.get("token");
//   }
// }

/**
 * Handles the connection client
 */
function ClientRoot() {
  const setClient = useSetRecoilState(clientState);
  const { pushSidePanel } = useSidePanels();
  const setPrompts = useSetRecoilState(promptsState);

  useEffect(() => {
    // if (flag) {
    setClient(new FakeClient());
    pushSidePanel(new ExplorerPanel());
    // pushSidePanel(new GitPanel());
    pushSidePanel(new SerachPanel());
    setPrompts((val) => [...val, GlobalPrompt]);
    // }
    // Retrieve the token and then create a new client
    // getToken().then(async (token) => {
    //   if (token !== null) {
    //     const client = await createClient(token);
    //     // Wait until it's connected
    //     client.whenConnected().then(() => {
    //       setClient(client);
    //       pushSidePanel(new ExplorerPanel());
    //       pushSidePanel(new GitPanel());
    //       setPrompts((val) => [...val, GlobalPrompt]);
    //     });
    //   }
    // });
  }, []);

  return null;
}

const theme = {
  config: {
    initialColorMode: 'dark', // ダークモードをデフォルトに設定
    useSystemColorMode: false,
  },
};

function App() {
  const isWindows = window.navigator.platform === 'Win32';

  //   const { colorMode, toggleColorMode } = useColorMode();
  localStorage.setItem('chakra-ui-color-mode', 'dark');

  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <RecoilRoot>
        <ClientRoot />
        <RecoilNexus />
        <Theme>
          <RootView isWindows={isWindows}>
            {isWindows && <TitleBar />}
            <div>
              <SplitPane split="vertical" minSize={250} defaultSizes={[2, 10]}>
                <SidePanelsView />
                <ViewsView />
              </SplitPane>
            </div>
            <WindowsView />
            <ContextMenuView />
            <StatusBarView />
            <NotificationsView />
            <Commands />
          </RootView>
        </Theme>
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default App;
