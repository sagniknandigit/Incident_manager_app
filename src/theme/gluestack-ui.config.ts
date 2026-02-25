import { createConfig } from '@gluestack-ui/themed';
import { config as defaultConfig } from '@gluestack-ui/config';

export const config = createConfig({
    ...defaultConfig,
    tokens: {
        ...defaultConfig.tokens,
        colors: {
            ...defaultConfig.tokens.colors,
            primary500: '#6366F1', // Our Indigo 500
            secondary500: '#38BDF8', // Our Sky 400
            background900: '#0F172A', // Our Slate 900
        },
    },
});

type ConfigType = typeof config;

declare module '@gluestack-ui/themed' {
    interface ICustomConfig extends ConfigType { }
}
