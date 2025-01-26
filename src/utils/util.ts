import { E_Item_Types } from "./interface";

export const domainEnv = process.env.ENV === 'prod' ? '' : '/api';

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${domainEnv}/twitch/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);
