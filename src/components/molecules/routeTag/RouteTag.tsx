import { Box, Icon, Skeleton, Text } from '@chakra-ui/react';
import { ElementType } from 'react';

type RouteTagProps = {
  text: string;
  textColor?: string;
  bgColor?: string;
  withPadding?: boolean;
  icon?: ElementType;
  loading: boolean;
};

export const RouteTag = ({
  text,
  icon,
  textColor,
  bgColor,
  loading,
  withPadding = false,
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
          p={withPadding ? '4px 12px' : '0'}
          borderRadius={'32px'}
          bgColor={bgColor}
        >
          {icon && (
            <Box color={textColor}>
              <Icon as={icon} w={'14px'} h={'14px'} color={textColor} />
            </Box>
          )}
          <Text
            textStyle="regular.5"
            noOfLines={1}
            fontSize={'12px'}
            color={textColor}
          >
            {text}
          </Text>
        </Box>
      )}
    </>
  );
};
