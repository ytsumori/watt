import { defineStyleConfig, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

export const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "orange"
  }),
  {
    components: {
      Button: defineStyleConfig({
        defaultProps: {
          size: "sm"
        }
      }),
      Spinner: defineStyleConfig({
        defaultProps: {
          size: "xl"
        },
        baseStyle: {
          color: "orange.500"
        }
      }),
      Menu: defineMultiStyleConfig({
        baseStyle: definePartsStyle({
          groupTitle: {
            mx: 3
          }
        })
      })
    }
  }
);
