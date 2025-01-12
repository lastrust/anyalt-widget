import React, { FC, ReactNode } from "react";
import { Provider } from "./components/ui/provider";
import { Button } from "@chakra-ui/react";

interface AarnaBoilerplate {
  message: string;
}

const AarnaBoilerplate: FC<AarnaBoilerplate> = ({ message }): ReactNode => {
  return (
    <Provider>
      <Button
        colorPalette="blue"
        colorScheme="blue"
        variant="outline"
        size="lg"
        borderRadius="full"
        fontWeight="bold"
      >
        {message}
      </Button>
    </Provider>
  );
};

export default AarnaBoilerplate;
