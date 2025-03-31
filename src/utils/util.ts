import { E_Item_Types } from "./interface";

export const domainEnv = process.env.NEXT_PUBLIC_ENV === 'prod' ? process.env.NEXT_PUBLIC_SERVER_HOST : '/api';

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${domainEnv}/twitch/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);
