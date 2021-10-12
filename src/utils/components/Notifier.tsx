import { Alert, Snackbar } from "@mui/material";
import React from "react";

let openSnackbarFn: { (props: SnackbarInput): void };

interface NotifierState {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

interface SnackbarInput {
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

class Notifier extends React.Component {
  public readonly state: NotifierState = {
    open: false,
    message: "",
    severity: "success",
  };

  public componentDidMount(): void {
    openSnackbarFn = this.openSnackbar;
  }

  public openSnackbar = ({ message, severity }: SnackbarInput): void => {
    this.handleSnackbarClose();
    this.setState({ message, severity, open: true });
  };

  public handleSnackbarClose = (): void =>
    this.setState({ message: "", open: false });

  public render(): JSX.Element {
    const { message, severity, open } = this.state;
    return (
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={this.handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={severity} onClose={this.handleSnackbarClose}>
          {message}
        </Alert>
      </Snackbar>
    );
  }
}

export function openSnackbar({ message, severity }: SnackbarInput): void {
  openSnackbarFn({ message, severity });
}

export default Notifier;
