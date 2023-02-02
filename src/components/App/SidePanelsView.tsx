import { Box, Flex } from '@chakra-ui/react';
// import styled from 'styled-components';
import useSidePanels from '../../hooks/useSidePanels';
import useTabs from '../../hooks/useTabs';
import SettingsTab from '../../tabs/settings';
import { SettingsGear } from '../Icons';
import IconButton from '../SideBar/SideBarButton';

// const PanelsContainer = styled.div`
//   display: flex;
//   min-height: 100%;
//   background: ${(props) => props.theme.tones.dark1};
// `;

/*
 * Sidebar that contains all the loaded side panels
 */
function SidePanelsView() {
  const { sidePanels, selectSidePanel, selectedSidePanelName } =
    useSidePanels();

  const { openTab } = useTabs();
  return (
    <Flex minH="100%">
      <Flex flexDirection="column" justify="space-between" width="60px">
        <div>
          {sidePanels.map((panel) => {
            const isSelected = panel.name === selectedSidePanelName;
            const PanelIcon = panel.icon;
            return (
              <IconButton
                key={panel.name}
                onClick={() => selectSidePanel(panel.name)}
                selected={isSelected}
              >
                <PanelIcon />
              </IconButton>
            );
          })}
        </div>
        <IconButton
          onClick={() => {
            openTab(new SettingsTab());
          }}
          selected={false}
        >
          <SettingsGear width="36px" height="36px" />
        </IconButton>
      </Flex>
      <Box
        borderLeft="1px solid rgba(48,48,48)"
        borderTop="1px solid rgba(48,48,48)"
        borderBottom="1px solid rgba(48,48,48)"
        // background="#222222"
        width="100%"
        // borderTopLeftRadius="5px"
        // borderBottomLeftRadius="5px"
        overflow="auto"
        maxHeight="100%"
        maxWidth="100%"
      >
        {sidePanels.map((panel) => {
          if (panel.name === selectedSidePanelName) {
            const PanelContainer = panel.container;
            return <PanelContainer key={panel.name} />;
          }
        })}
      </Box>
    </Flex>
  );
}

export default SidePanelsView;
