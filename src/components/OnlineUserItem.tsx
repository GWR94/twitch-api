import { useState } from "react";
import { createTheme, Tooltip, Typography, useMediaQuery } from "@mui/material";
import partnerImg from "../images/verified.png";
import placeholder from "../images/placeholder.png";
import notFoundImg from "../images/twitch-not-found.jpg";
import { OnlineUser } from "../interfaces/twitchAPI.i";

interface OnlineUserProps {
  user: OnlineUser;
  matureFilter: boolean;
  removeUser: (user: string, online: boolean) => void;
}

const OnlineUserItem = ({
  user,
  matureFilter,
  removeUser,
}: OnlineUserProps): JSX.Element | null => {
  const {
    name,
    link,
    online,
    image,
    game,
    viewers,
    mature,
    partner,
    preview,
    status,
  } = user;

  const [showComponent, setShowComponent] = useState<boolean>(true);

  const theme = createTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const onRemoveUser = (): void => {
    const userToRemove = document.getElementById(name);
    userToRemove?.classList.remove("animate__fadeInLeft");
    userToRemove?.classList.add("animate__fadeOutLeft");
    setTimeout((): void => {
      setShowComponent(false);
      removeUser(name, online);
    }, 500);
  };

  return !showComponent ? null : (
    <div
      id={name}
      className="user__container animate__animated animate__fadeInLeft user__onlineUser"
    >
      <div className="user__details">
        <div className="user__online">
          <div className="user__imageContainer">
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
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                alt={name}
                src={image || placeholder}
                className="user__image"
              />
            </a>
            <h4 className="user__name">{name}</h4>
          </div>
          <div className="user__infoContainer">
            <Typography className="user__text">
              <span className="user__boldText">Status: </span> Live now!
            </Typography>
            <Typography className="user__text">
              <span className="user__boldText">Currently Playing: </span> {game}
            </Typography>
            <Typography className="user__text">
              <span className="user__boldText">Stream Title: </span> {status}
            </Typography>
            <Typography className="user__text">
              <span className="user__boldText">Viewers: </span> {viewers}
            </Typography>
            <Typography className="user__text">
              <span className="user__boldText">Mature Content: </span>{" "}
              {mature ? " Yes " : " No "}
            </Typography>
          </div>
        </div>
        <i
          role="button"
          onClick={onRemoveUser}
          onKeyPress={onRemoveUser}
          className="fa fa-times user__deleteIcon"
          tabIndex={0}
        />
      </div>
      {desktop && (
        <div className="user__preview">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <img
              alt={`${name} stream preview`}
              src={preview || notFoundImg}
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

export default OnlineUserItem;
