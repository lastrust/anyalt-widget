import { Box, Icon, Skeleton, Text } from '@chakra-ui/react';
import { ElementType } from 'react';

type RouteTagProps = {
  text: string;
  textColor?: string;
  bgColor?: string;
  withBorder?: boolean;
  icon?: ElementType;
  loading: boolean;
};

export const RouteTag = ({
  text,
  icon,
  textColor,
  bgColor,
  loading,
  withBorder = true,
}: RouteTagProps) => {
  return (
    <>
      {loading ? (
        <Skeleton w={'50px'} h={'25px'} borderRadius={'32px'} />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap="4px"
          p="7px 12px"
          borderRadius={'32px'}
          bgColor={bgColor}
          border={withBorder ? '1px solid #008080' : 'none'}
          borderColor={withBorder ? 'brand.border.tag' : 'transparent'}
        >
          {icon && (
            <Box color={textColor}>
              <Icon as={icon} w={'14px'} h={'14px'} />
            </Box>
          )}
          <Text textStyle="bold.5" color={textColor}>
            {text}
          </Text>
        </Box>
      )}
    </>
  );
};
