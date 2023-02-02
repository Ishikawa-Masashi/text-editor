import * as React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';
// import styled from "styled-components";

// const LogoIcon = styled.img`
//     width: 20px;
//     height: 20px;
//     position: absolute;
//     left: 7px;
//     top: 5px;
//     user-selects: none;
// `;

const LogoIcon = (props: React.PropsWithChildren<ImageProps>) => {
  const { children, ...rest } = props;
  return <Image {...rest}>{children}</Image>;
};

export default LogoIcon;
