import React, { useEffect, useState } from "react";
import { Tooltip, Typography, useMediaQuery } from "@mui/material";
import day from "dayjs";
import {
  OfflineUserState,
  OfflineUserProps,
} from "../interfaces/userDataItem.i";
import notFoundImage from "../images/twitch-not-found.jpg";
import placeholder from "../images/placeholder.png";
import partnerImg from "../images/verified.png";
import { createTheme } from "@mui/system";

const initialState: OfflineUserState = {
  showComponent: true,
  userData: null,
};

const UserDataItem: React.FC<OfflineUserProps> = ({
  name,
  link,
  online,
  mature,
  image,
  partner,
  matureFilter,
  offlineImage,
  removeUser,
}): JSX.Element | null => {
  const [state, setState] = useState<OfflineUserState>(initialState);

  useEffect((): void => {
    const userDataJSON = localStorage.getItem(name);
    const userData = JSON.parse(userDataJSON as string);
    setState({ ...state, userData });
  }, [name, state]);

  const theme = createTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const onRemoveUser = (): void => {
    const userToRemove = document.getElementById(name);
    userToRemove?.classList.remove("animate__fadeInLeft");
    userToRemove?.classList.add("animate__fadeOutLeft");
    setTimeout((): void => {
      setState({ ...state, showComponent: false });
      removeUser(name, online);
    }, 500);
  };

  const { showComponent, userData } = state;

  if (!showComponent) return null;
  return (
    <div
      id={name}
      className="user__container animate__animated animate__fadeInLeft user__offlineUser"
    >
      <div className="user__details">
        <div className="user__offline">
          <div className="user__imageContainer">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <div className="user__image">
                {partner && (
                  <Tooltip
                    title="Verified Twitch Partner"
                    arrow
                    placement="right-start"
                  >
                    <img
                      src={partnerImg}
                      alt="Verified Twitch Partner"
                      className="user__partner"
                    />
                  </Tooltip>
                )}
                <img alt={name} src={image || placeholder} />
              </div>
            </a>
            <h4 className="user__name">{name}</h4>
          </div>
          <div className="user__infoContainer">
            {!userData ? (
              <>
                <Typography className="user__text">
                  <span className="user__boldText">Status:</span> User is
                  offline
                </Typography>
                <Typography className="user__text">
                  <span className="user__boldText">Last Seen:</span> Never
                </Typography>
              </>
            ) : (
              <>
                <Typography className="user__text">
                  <span className="user__boldText">Status:</span> User is
                  offline
                </Typography>
                <Typography className="user__text">
                  <span className="user__boldText">Last Played: </span>{" "}
                  {userData.lastGame}
                </Typography>
                <Typography className="user__text">
                  <span className="user__boldText">Last Seen: </span>
                  {day(userData.lastSeen).format("MMM D, YYYY h:mm A")}
                </Typography>
              </>
            )}
          </div>
        </div>
        <i
          role="button"
          onClick={onRemoveUser}
          className="fa fa-times user__deleteIcon"
          tabIndex={0}
        />
      </div>
      {desktop && (
        <div className="user__preview">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <img
              alt={`${name} stream preview`}
              src={offlineImage || notFoundImage}
              id={`${name}-img`}
              className={
                mature && matureFilter
                  ? "user__streamPreview--mature"
                  : "user__streamPreview"
              }
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default UserDataItem;
