import * as React from 'react';
import { Box } from '@chakra-ui/react';

export function Separator() {
  return (
    <Box
      padding="0.2em 0 0"
      marginBottom="0.2em"
      borderBottom="1px solid #bbb"
      marginLeft="0.8em !important"
      marginRight="0.8em !important"
      height="0px !important"
    ></Box>
  );
}
