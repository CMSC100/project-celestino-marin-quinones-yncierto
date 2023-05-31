import "./NavigationButton.css";
import { tokens } from "../../../../theme";
import { useTheme } from "@emotion/react";
import { IconButton } from "@mui/material";

export default function NavigationButton(props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    const { navbuttons } = props
    return (
        <ul className="NavButtons">
            {navbuttons.map((btn) => {
                return <li key={btn.name} >
                    <button type="button" className="indivBtn" >
                        <IconButton>{btn.icon}</IconButton>
                        {btn.name}
                    </button>
                </li>
            })}
        </ul>
    )
}