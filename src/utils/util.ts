import { E_Item_Types } from "./interface";

export const domainEnv = process.env.NEXT_PUBLIC_ENV === 'prod' ? 'http://ec2-54-253-97-210.ap-southeast-2.compute.amazonaws.com' : '/api';

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${domainEnv}/twitch/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);
