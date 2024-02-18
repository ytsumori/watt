import {
  defineStyleConfig,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";

export const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "cyan",
  }),
  {
    components: {
      Button: defineStyleConfig({
        defaultProps: {
          size: "sm",
        },
      }),
      Spinner: defineStyleConfig({
        defaultProps: {
          size: "xl",
        },
        baseStyle: {
          color: "cyan.500",
        },
      }),
    },
  }
);
