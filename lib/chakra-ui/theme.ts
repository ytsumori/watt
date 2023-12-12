import { defineStyleConfig, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Button: defineStyleConfig({
      defaultProps: {
        size: "sm",
        colorScheme: "cyan",
      },
    }),
  },
});
