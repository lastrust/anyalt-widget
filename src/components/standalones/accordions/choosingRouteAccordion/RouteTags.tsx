import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { Flex } from '@chakra-ui/react';
import { RouteTag } from '../../../molecules/routeTag/RouteTag';

const colorsMap = {
  fastest: {
    text: '#3777F7',
    bg: 'rgba(55, 119, 247, 0.10)',
  },
  bestReturn: {
    text: '#00A958',
    bg: 'rgba(0, 169, 88, 0.10)',
  },
  lowestFee: {
    text: '#FF2D99',
    bg: 'rgba(255, 45, 153, 0.10)',
  },
  leastTransactions: {
    text: '#FF9900',
    bg: 'rgba(255, 153, 0, 0.10)',
  },
  executable: {
    text: '#006400',
    bg: 'rgba(0, 100, 0, 0.15)',
  },
};

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'fastest':
      return colorsMap.fastest;
    case 'Best Return':
      return colorsMap.bestReturn;
    case 'Lowest Fee':
      return colorsMap.lowestFee;
    case 'Least Transactions':
      return colorsMap.leastTransactions;
    case 'Executable':
      return colorsMap.executable;
    default:
      return colorsMap.fastest;
  }
};

type Props = {
  loading: boolean;
  route: GetAllRoutesResponseItem;
};

export const RouteTags = ({ loading, route }: Props) => {
  return (
    <Flex alignItems="center" gap="8px" w={'100%'}>
      {route?.isExecutable && (
        <RouteTag
          loading={loading}
          text={'#Executable'}
          textColor={getTagColor('Executable').text}
          bgColor={getTagColor('Executable').bg}
          withPadding
        />
      )}
      {route.tags.map((tag, index) => {
        return (
          <RouteTag
            key={`${tag}-${index}`}
            loading={loading}
            text={`#${tag}`}
            textColor={getTagColor(tag).text}
            bgColor={getTagColor(tag).bg}
            withPadding
          />
        );
      })}
    </Flex>
  );
};
