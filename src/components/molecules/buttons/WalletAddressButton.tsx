import { HStack, Image, Text } from '@chakra-ui/react';

type Props = {
  isConnected: boolean;
  alt: string;
  imgURL: string;
  onClick?: (() => void) | undefined;
  children: React.ReactNode;
};

export const WalletAddressButton = ({
  imgURL,
  alt,
  onClick,
  children,
  isConnected,
}: Props) => {
  if (!isConnected) return null;

  return (
    <HStack>
      <Image src={imgURL} w={'16px'} h={'16px'} alt={alt} />
      <Text
        cursor={'pointer'}
        textStyle={'regular.3'}
        color="brand.text.secondary.2"
        onClick={onClick}
        noOfLines={1}
        maxW={'300px'}
      >
        {children}
      </Text>
    </HStack>
  );
};
