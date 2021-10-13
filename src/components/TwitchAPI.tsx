import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import TwitchState, {
  OnlineUser,
  SavedUser,
  OfflineUser,
  ShowUserType,
} from "../interfaces/twitchAPI.i";
import background from "../images/background.jpg";
import { openSnackbar } from "../utils/components/Notifier";
import Header from "./Header";
import OnlineUsers from "./OnlineUsers";
import OfflineUsers from "./OfflineUsers";

const storedUsers = localStorage?.getItem("users");

const initialState: TwitchState = {
  users: storedUsers
    ? JSON.parse(storedUsers)
    : ["summit1g", "Pestily", "DeadlySlob"],
  onlineUserData: [
    {
      game: "Escape from Tarkov",
      image:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/d4d79c6d-e57c-487d-912d-e13e85d1a7bf-profile_image-300x300.png",
      link: "https://www.twitch.tv/Glorious_E",
      mature: true,
      name: "Glorious_E",
      online: true,
      partner: true,
      preview:
        "https://static-cdn.jtvnw.net/previews-ttv/live_user_glorious_e-1024x576.jpg",
      status:
        "Twitch Rivals EU Tonight| !Youtube | !Snap | !Socials | !Glorious | !Merch",
      viewers: "796",
    },
  ],
  offlineUserData: [],
  matureFilter: true,
  show: "all",
};

const TwitchAPI: React.FC = (): JSX.Element => {
  const [state, setState] = useState<TwitchState>(initialState);

  const handleGetAuthentication = async (): Promise<void> => {
    try {
      const res = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${process.env.REACT_APP_TWITCH_ACCESS_TOKEN}&grant_type=client_credentials`,
        { method: "POST" }
      );
      const user = await res.json();
      return user.access_token;
    } catch (err) {
      console.error(err);
    }
  };

  const getStreamerData = async (newStreamer?: string): Promise<void> => {
    const bearer = await handleGetAuthentication();
    const { users, onlineUserData, offlineUserData } = state;
    if (newStreamer) users.push(newStreamer);
    try {
      const res = await fetch(
        `https://api.twitch.tv/helix/users?${users
          .map((user): string => `&login=${user}`)
          .join("")}`,
        {
          headers: {
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID as string,
            Authorization: `Bearer ${bearer}` as string,
          },
        }
      );
      const user = await res.json();
      const usersArr = user.data;

      usersArr.map(async (user): Promise<void> => {
        const res = await fetch(
          `https://api.twitch.tv/helix/streams?user_id=${user.id}`,
          {
            headers: {
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID as string,
              Authorization: `Bearer ${bearer}` as string,
            },
          }
        );
        const stream = await res.json();
        if (stream.data.length > 0) {
          const streamData = stream.data[0];
          const onlineUser: OnlineUser = {
            name: streamData.user_name,
            status: streamData.title,
            partner: user.broadcaster_type === "partner",
            game: streamData.game_name,
            viewers: streamData.viewer_count,
            image: user.profile_image_url,
            online: true,
            preview: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${user.login}-1024x576.jpg`,
            mature: streamData.is_mature,
            link: `https://www.twitch.tv/${streamData.user_name}`,
          };

          if (
            !onlineUserData.find((user): boolean => {
              return user.name === onlineUser.name;
            })
          ) {
            onlineUserData.push(onlineUser);
          }
          setState({
            ...state,
            onlineUserData,
          });

          const savedUser: SavedUser = {
            name: streamData.user_name,
            lastGame: streamData.game_name,
            image: streamData.profile_image_url,
            partner: user.broadcaster_type === "partner",
            lastSeen: streamData.started_at,
            link: `https://www.twitch.tv/${streamData.user_name}`,
          };
          localStorage.setItem(savedUser.name, JSON.stringify(savedUser));
        } else {
          const offlineUser: OfflineUser = {
            name: user.display_name,
            partner: user.broadcaster_type === "partner",
            online: false,
            image: user.profile_image_url,
            offlineImage: user.offline_image_url,
            link: `https://www.twitch.tv/${user.display_name}`,
          };
          if (
            !offlineUserData.find(
              (user): boolean => user.name === offlineUser.name
            )
          ) {
            offlineUserData.push(offlineUser);
          }
          setState({
            ...state,
            offlineUserData,
          });
        }
      });
    } catch (err) {
      openSnackbar({
        severity: "error",
        message: "Unable to retrieve streamers. Please try reloading the page.",
      });
    }
  };

  const onAddNewStreamer = async (
    streamer: string
  ): Promise<boolean | void> => {
    const bearer = await handleGetAuthentication();

    const users = [...state.users, streamer];

    try {
      const res = await fetch(
        `https://api.twitch.tv/helix/users?login=${streamer}`,
        {
          headers: {
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID as string,
            Authorization: `Bearer ${bearer}` as string,
          },
        }
      );
      const user = await res.json();
      const { view_count, description } = user.data[0];
      if (view_count === 0 && description.length === 0) {
        openSnackbar({
          severity: "error",
          message: "Streamer doesn't seem to exist. Please try again.",
        });
        return false;
      }

      localStorage.setItem("users", JSON.stringify(users));
      setState({ ...state, users });
      openSnackbar({
        severity: "success",
        message: "Steamer successfully added to list!",
      });
    } catch (err) {
      console.error(err);
    }
    return true;
  };

  useEffect((): void => {
    getStreamerData();
  }, [state.users]);

  const onRemoveUser = (user: string, online: boolean): void => {
    const { users, onlineUserData, offlineUserData } = state;
    if (online) {
      for (const key in onlineUserData) {
        if (onlineUserData.hasOwnProperty(key)) {
          const val = onlineUserData[key];
          if (val.name === user) delete onlineUserData[key];
        }
      }
    } else {
      for (const key in offlineUserData) {
        if (offlineUserData.hasOwnProperty(key)) {
          const val = offlineUserData[key];
          if (val.name === user) delete offlineUserData[key];
        }
      }
    }
    const idx = users.indexOf(user);
    users.splice(idx, 1);
    const storedUsers = localStorage.getItem("users");
    const userData = JSON.parse(storedUsers as string);
    const index = userData.indexOf(user);
    userData.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(userData));
    setState({ ...state, users, onlineUserData, offlineUserData });
  };

  const { onlineUserData, offlineUserData, show, matureFilter } = state;

  return (
    <div
      className="twitch__container"
      style={{ background: `url(${background})` }}
    >
      <div className="twitch__header">
        <Header
          show={show}
          setShow={(show: ShowUserType): void => setState({ ...state, show })}
          handleAddStreamer={(streamer: string) => onAddNewStreamer(streamer)}
          matureFilter={matureFilter}
          setMatureFilter={(matureFilter: boolean): void =>
            setState({ ...state, matureFilter })
          }
        />
      </div>
      <Container>
        <OnlineUsers
          users={onlineUserData}
          matureFilter={matureFilter}
          handleRemoveUser={onRemoveUser}
        />
        <OfflineUsers
          users={offlineUserData}
          matureFilter={matureFilter}
          handleRemoveUser={onRemoveUser}
        />
      </Container>
      <div className="twitch__footer-container">
        <footer className="twitch__footer" />
      </div>
    </div>
  );
};

export default TwitchAPI;
