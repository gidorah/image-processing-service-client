import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  // Tells Storybook where to find your story files
  stories: ["../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  // Lists the addons that provide extra features
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],

  // Specifies the framework integration (Next.js in this case)
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  // Enables automatic documentation generation
  docs: {
    autodocs: "tag",
  },
};

export default config;
