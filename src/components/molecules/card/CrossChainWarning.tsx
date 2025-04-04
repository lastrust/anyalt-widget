import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { TEXTS } from '../../../constants/text';
import { InfoIcon } from '../../atoms/icons/InfoIcon';

export const CrossChainWarningCard = () => {
  return (
    <Tooltip
      label={TEXTS.crossChainWarning}
      color="white"
      borderRadius="8px"
      padding="12px"
      bgColor="black"
      cursor={'pointer'}
    >
      <HStack
        alignItems="center"
        gap="4px"
        cursor="pointer"
        w="100%"
        justifyContent={'end'}
        color="brand.text.primary"
      >
        <Icon as={InfoIcon} />
        <Text textStyle={'regular.3'}>Disclaimer</Text>
      </HStack>
    </Tooltip>
  );
};
