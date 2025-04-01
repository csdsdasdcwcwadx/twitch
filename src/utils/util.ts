import { E_Item_Types } from "./interface";

export const domainEnv = process.env.NEXT_PUBLIC_ENV === 'prod' ? `${process.env.NEXT_PUBLIC_SERVER_HOST}/twitch` : '/api';

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${domainEnv}/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);
