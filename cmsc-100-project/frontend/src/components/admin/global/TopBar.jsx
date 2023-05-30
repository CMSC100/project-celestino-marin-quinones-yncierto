import { Box, IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../../../theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';


const TopBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    return (<Box display="flex" justifyContent= "end" p={2}>
        <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "light" ? (
                <LightModeIcon/>
            ) : (<DarkModeIcon/>)}
        </IconButton>
    </Box>)
}

export default TopBar;