import { Box, BoxProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  activeStep: number;
} & BoxProps;

const Stepper = ({ children, activeStep, ...props }: Props) => {
  return (
    <Box {...props}>
      {children &&
        React.Children.toArray(children)
          .filter((child) => {
            return React.Children.count(child);
          })
          .map((child, index) => {
            if (index === activeStep) {
              return child;
            }
          })}
    </Box>
  );
};

export default Stepper;
