export default interface TwitchState {
  users: string[];
  onlineUserData: OnlineUser[];
  offlineUserData: OfflineUser[];
  matureFilter: boolean;
  show: ShowUserType;
}

export type ShowUserType = "all" | "offline" | "online";
export interface APICall {
  result: object;
  stream: {
    game: string;
    viewers: string;
    average_fps: number;
    created_at: string;
    preview: {
      medium: string;
    };
    channel: {
      status: string;
      logo: string;
      mature: boolean;
    };
  };
  game: object;
}

export interface OnlineUser {
  name: string;
  game: string;
  status: string;
  partner: boolean;
  viewers: string;
  image: string;
  online: boolean;
  preview: string;
  mature: boolean;
  link: string;
  lastSeen?: string;
  lastGame?: string;
}

export interface SavedUser {
  name: string;
  lastGame: string;
  partner: boolean;
  image: string;
  lastSeen: string;
  link: string;
}

export interface OfflineUser {
  name: string;
  image: string;
  online: boolean;
  offlineImage: string;
  link: string;
  partner: boolean;
}
