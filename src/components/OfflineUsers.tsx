import React from "react";
import { OfflineUser } from "../interfaces/twitchAPI.i";
import OfflineUserItem from "./OfflineUserItem";

interface OfflineUsersProps {
  users: OfflineUser[];
  matureFilter: boolean;
  handleRemoveUser: (user: string, online: boolean) => void;
}

const OfflineUsers = ({
  users,
  matureFilter,
  handleRemoveUser,
}: OfflineUsersProps) => {
  return (
    <div id="offline-users">
      {users.length > 0 &&
        users.map(
          (user: OfflineUser, i: number): JSX.Element => (
            <OfflineUserItem
              key={i}
              {...user}
              matureFilter={matureFilter}
              removeUser={handleRemoveUser}
            />
          )
        )}
    </div>
  );
};

export default OfflineUsers;
