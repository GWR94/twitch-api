import ReactDOM from "react-dom";
import TwitchAPI from "./components/TwitchAPI";
import Notifier from "./utils/components/Notifier";
import "./scss/styles.scss";
import "normalize.css";
import "animate.css";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <Notifier />
        <TwitchAPI />
      </ThemeProvider>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
