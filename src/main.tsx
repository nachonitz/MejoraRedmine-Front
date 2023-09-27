import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./context/UserProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainerWrapper } from "./components/Shared/Toast/container.tsx";

const theme = createTheme({
    typography: {
        fontFamily: `"Inter", "sans-serif"`,
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Router>
            <UserProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ThemeProvider theme={theme}>
                        <App />
                        <ToastContainerWrapper />
                    </ThemeProvider>
                </LocalizationProvider>
            </UserProvider>
        </Router>
    </React.StrictMode>
);
