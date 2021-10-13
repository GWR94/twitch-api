import {
  Typography,
  Button,
  OutlinedInput,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ShowUserType } from "../interfaces/twitchAPI.i";

interface HeaderProps {
  show: "all" | "online" | "offline";
  setShow: (show: ShowUserType) => void;
  handleAddStreamer: (streamer: string) => void;
  matureFilter: boolean;
  setMatureFilter: (filter: boolean) => void;
}

const Header = ({
  show,
  setShow,
  handleAddStreamer,
  matureFilter,
  setMatureFilter,
}: HeaderProps): JSX.Element => {
  const [streamer, setStreamer] = useState("");

  useEffect((): (() => void) => {
    const input = document.getElementById("streamer-input");

    const handleFormInput = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        setStreamer("");
        handleAddStreamer(streamer);
      }
    };

    input?.addEventListener("keydown", handleFormInput);

    return (): void => {
      input?.removeEventListener("keydown", handleFormInput);
    };
  }, [handleAddStreamer, streamer]);

  const handleAnimate = (node: HTMLElement | null, hide: boolean): boolean => {
    if (!node) return false;
    if (hide) {
      node.className = "animate__animated animate__fadeOutLeft";
      setTimeout((): void => {
        node.className = "hidden";
      }, 500);
    } else {
      node.className = "animate__animated animate__fadeInLeft";
    }
    return true;
  };

  const onShowOnlineUsers = (): void => {
    const online = document.getElementById("online-users");
    const offline = document.getElementById("offline-users");

    switch (show) {
      case "all":
        handleAnimate(offline, true);
        break;
      case "offline":
        handleAnimate(offline, true);
        handleAnimate(online, false);
        break;
      default:
        return;
    }
    setShow("online");
  };

  const onShowAllUsers = (): void => {
    const online = document.getElementById("online-users");
    const offline = document.getElementById("offline-users");

    switch (show) {
      case "online":
        handleAnimate(offline, false);
        break;
      case "offline":
        handleAnimate(online, false);
        break;
      default:
        return;
    }
    setShow("all");
  };

  const onShowOfflineUsers = (): void => {
    const online = document.getElementById("online-users");
    const offline = document.getElementById("offline-users");

    switch (show) {
      case "all":
        handleAnimate(online, true);
        break;
      case "online":
        handleAnimate(online, true);
        handleAnimate(offline, false);
        break;
      default:
        return;
    }
    setShow("offline");
  };
  return (
    <Container maxWidth="md">
      <Typography className="header__title">Twitch Streamers</Typography>
      <Typography variant="subtitle1" className="header__subtitle" gutterBottom>
        Check out the status of your latest streamers!
      </Typography>
      <Typography variant="subtitle1" className="header__text" gutterBottom>
        Feel free to add and remove streamers at any time, as they will be
        stored on your device so you can come back and check their status
        whenever you'd like.
      </Typography>
      <Typography variant="subtitle2" className="header__text">
        You can remove any streamers you don&apos;t want to follow by pressing
        the red cross.
      </Typography>
      <div className="header__button--container">
        <Button
          className="header__button"
          color="success"
          fullWidth
          variant={show === "online" ? "contained" : "outlined"}
          onClick={onShowOnlineUsers}
          style={{ margin: "0 3px" }}
        >
          Online
        </Button>
        <Button
          className="header__button"
          color="warning"
          fullWidth
          variant={show === "all" ? "contained" : "outlined"}
          onClick={onShowAllUsers}
          style={{ margin: "0 3px" }}
        >
          All
        </Button>
        <Button
          className="header__button"
          color="error"
          fullWidth
          variant={show === "offline" ? "contained" : "outlined"}
          onClick={onShowOfflineUsers}
          style={{ margin: "0 3px" }}
        >
          Offline
        </Button>
      </div>
      <div className="header__input--container">
        <FormControl size="small" variant="outlined">
          <InputLabel variant="outlined">Streamer Name</InputLabel>
          <OutlinedInput
            id="streamer-input"
            value={streamer}
            label="Streamer Name"
            onChange={(e): void => setStreamer(e.target.value)}
            size="small"
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              height: 40,
            }}
          />
        </FormControl>
        <Button
          size="small"
          variant="outlined"
          className="header__search--button"
          color="info"
          onClick={(): void => {
            setStreamer("");
            handleAddStreamer(streamer);
          }}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 40,
          }}
        >
          Add Streamer
        </Button>
      </div>
      <div className="header__mature--container">
        <Typography className="header__mature--text">Mature Filter:</Typography>
        <div className="header__mature--switch">
          <label htmlFor="check" className="header__switch">
            <input
              id="check"
              type="checkbox"
              checked={matureFilter}
              onChange={(e): void => setMatureFilter(e.target.checked)}
            />
            <span className="header__slider header__round" />
          </label>
        </div>
      </div>
    </Container>
  );
};

export default Header;
