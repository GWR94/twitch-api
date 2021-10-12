import { OnlineUser } from "./twitchAPI.i";

export interface OfflineUserProps {
  name: string;
  online: boolean;
  mature?: boolean;
  link: string;
  image: string;
  removeUser: Function;
  matureFilter: boolean;
  partner: boolean;
  offlineImage: string;
}

export interface OfflineUserState {
  showComponent: boolean;
  userData: OnlineUser | null;
}
