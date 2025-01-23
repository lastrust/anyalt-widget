import { Box, BoxProps, Button, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { getImageURL } from '../../utils';

type Props = BoxProps & {
  onClick: () => void;
};

export const TokenAccept: FC<Props> = ({ onClick, ...props }) => {
  return (
    <Box
      borderRadius="8px"
      bgColor="brand.primary"
      border="1px solid"
      borderColor="brand.quinary.100"
      padding="12px"
      {...props}
    >
      <Box display="flex" flexDir="row" alignItems="center" gap="8px" mb="8px">
        <Image src={getImageURL('warning-icon.svg')} alt="warning" />
        <Text color="brand.white" fontSize="16px" fontWeight="bold">
          Warning
        </Text>
      </Box>
      <Text color="brand.white" fontSize="14px" opacity={0.4} mb="12px">
        Anyone can create any token, including fake versions of the existing
        tokens. Take due care. Some tokens and their technical parameters may be
        incompatible with AnyAlt services. By importing this custom token you
        acknowledge and accept the risk.
      </Text>
      <Button
        bg="brand.tertiary.100"
        color="brand.white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        width="99px"
        onClick={onClick}
      >
        Accept
      </Button>
    </Box>
  );
};
