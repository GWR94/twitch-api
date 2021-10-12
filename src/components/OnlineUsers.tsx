import React from "react";
import { OnlineUser } from "../interfaces/twitchAPI.i";
import OnlineUserItem from "./OnlineUserItem";

interface OnlineUsersProps {
  users: OnlineUser[];
  matureFilter: boolean;
  handleRemoveUser: (user: string, online: boolean) => void;
}

const OnlineUsers = ({
  users,
  matureFilter,
  handleRemoveUser,
}: OnlineUsersProps) => {
  return (
    <div id="online-users">
      {users.length > 0 &&
        users
          .sort((a, b): number => (a.viewers < b.viewers ? 1 : -1))
          .map(
            (user, index): JSX.Element => (
              <OnlineUserItem
                key={index}
                user={user}
                matureFilter={matureFilter}
                removeUser={handleRemoveUser}
              />
            )
          )}
    </div>
  );
};

export default OnlineUsers;
