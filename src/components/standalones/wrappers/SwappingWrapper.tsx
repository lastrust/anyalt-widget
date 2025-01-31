import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import configIcon from '../../../assets/imgs/config-icon.svg';

type Props = {
  title?: string;
  secondTitle?: string;
  secondSubtitle?: string;
  onConfigClick: () => void;
  children: React.ReactNode;
};

export const SwappingWrapper = ({
  title,
  secondTitle,
  secondSubtitle,
  onConfigClick,
  children,
}: Props) => {
  return (
    <Box margin="24px 0px">
      <Grid gridTemplateColumns={secondTitle ? '1fr 1fr' : '1fr'} gap="16px">
        {title && (
          <Flex justifyContent="space-between" alignItems="center" mb="16px">
            <Text color="white" fontSize="24px" fontWeight="bold">
              {title}
            </Text>
            <Box cursor="pointer">
              <Image src={configIcon} alt="config" onClick={onConfigClick} />
            </Box>
          </Flex>
        )}
        {secondTitle && (
          <Flex
            justifyContent="space-between"
            flexDir={'column'}
            alignItems="left"
            mb="16px"
          >
            <Text color="white" fontSize="24px" fontWeight="bold">
              {secondTitle}
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight={'normal'}
              color="brand.secondary.2"
            >
              {secondSubtitle}
            </Text>
          </Flex>
        )}
      </Grid>
      {children}
    </Box>
  );
};
