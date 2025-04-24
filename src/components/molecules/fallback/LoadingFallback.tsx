import { Skeleton, SkeletonProps } from '@chakra-ui/react';

type Props = {
  loading: boolean;
  children: React.ReactNode;
} & SkeletonProps;

export const LoadingFallback = ({ loading, children, ...props }: Props) => {
  if (loading) return <Skeleton {...props} />;

  return children;
};
