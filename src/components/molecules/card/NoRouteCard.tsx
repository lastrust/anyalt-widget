import { Center, Text, VStack } from '@chakra-ui/react';
import { NoRouteIcon } from '../../atoms/icons/route/NoRouteIcon';

export const NoRouteCard = () => {
  return (
    <Center h={'400px'}>
      <VStack gap={'0'}>
        <NoRouteIcon />
        <Text textStyle={'heading.1'} mt={'24px'}>
          Sorry! No routes found
        </Text>
        <Text
          mt={'16px'}
          textStyle={'regular.1'}
          lineHeight={'140%'}
          color={'brand.text.secondary.2'}
        >
          Please select different token and try again.
        </Text>
      </VStack>
    </Center>
  );
};
