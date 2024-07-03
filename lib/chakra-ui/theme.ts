import { defineStyleConfig, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

export const theme = extendTheme(
  {
    colors: {
      brand: {
        50: process.env.IS_DEV ? "#f2f9f2" : "#fff5f5",
        100: process.env.IS_DEV ? "#cae8cc" : "#ffd7d5",
        200: process.env.IS_DEV ? "#9ad39f" : "#ffb2ae",
        300: process.env.IS_DEV ? "#5eb966" : "#ff8079",
        400: process.env.IS_DEV ? "#43a84b" : "#ff5d55",
        500: process.env.IS_DEV ? "#3D9D45" : "#FF5850", // main
        600: process.env.IS_DEV ? "#2f7836" : "#b9403a",
        700: process.env.IS_DEV ? "#26602b" : "#95332f",
        800: process.env.IS_DEV ? "#205124" : "#7e2b28",
        900: process.env.IS_DEV ? "#173b1a" : "#5b201d"
      }
    }
  },
  withDefaultColorScheme({
    colorScheme: "brand"
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
          color: "brand.400"
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
