import { defineStyleConfig, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);

export const theme = extendTheme(
  {
    colors: {
      brand: {
        50: "#FFFAF5",
        100: "#FFE5D0",
        200: "#FFD7B8",
        300: "#FFC8A0",
        400: "#FF5850", // main
        500: "#FF4D4D",
        600: "#DC3444"
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
