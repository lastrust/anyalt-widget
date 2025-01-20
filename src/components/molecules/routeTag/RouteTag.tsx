import { Box, Icon, Text } from '@chakra-ui/react';
import { ElementType } from 'react';

type RouteTagProps = {
  text: string;
  textColor?: string;
  bgColor?: string;
  icon?: ElementType;
};

export const RouteTag = ({ text, icon, textColor, bgColor }: RouteTagProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="4px"
      p="7px 12px"
      borderRadius={'32px'}
      bgColor={bgColor}
      border="1px solid #008080"
    >
      {icon && <Icon as={icon} w={'14px'} h={'14px'} />}
      <Text
        fontSize="14px"
        fontWeight="bold"
        color={textColor}
        lineHeight={'16px'}
      >
        {text}
      </Text>
    </Box>
  );
};
