import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { lightTheme, darkTheme } from '../theme/theme';

export const useTheme = () => {
    const mode = useSelector((state: RootState) => state.theme.mode);
    const theme = mode === 'light' ? lightTheme : darkTheme;

    return {
        theme,
        mode,
        isDark: mode === 'dark',
        colors: theme.colors,
    };
};
