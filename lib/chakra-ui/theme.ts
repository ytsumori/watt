import { switchAnatomy, tabsAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";

const { defineMultiStyleConfig: defineTabsStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);
const { defineMultiStyleConfig: defineSwitchStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

export const theme = extendTheme({
  components: {
    Button: defineStyleConfig({
      defaultProps: {
        size: "sm",
        colorScheme: "cyan",
      },
    }),
    Tabs: defineTabsStyleConfig({
      defaultProps: {
        colorScheme: "cyan",
      },
    }),
    Switch: defineSwitchStyleConfig({
      defaultProps: {
        colorScheme: "cyan",
      },
    }),
    Progress: defineStyleConfig({
      defaultProps: {
        size: "sm",
        colorScheme: "cyan",
      },
    }),
  },
});
