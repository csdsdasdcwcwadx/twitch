import { E_Item_Types } from "./interface";

export const redirectPath = process.env.NEXT_PUBLIC_ENV === "prod" ? "/twitch" : "/api";
export const domainEnv = `${process.env.NEXT_PUBLIC_SERVER_HOST}${redirectPath}`;

export const twitchIconDomain = "https://static-cdn.jtvnw.net";
export const ImagePath = `${redirectPath}/item/images/`;

export const ItemTypes = Object.values(E_Item_Types);
