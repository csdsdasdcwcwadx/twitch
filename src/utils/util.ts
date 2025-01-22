
export const domainEnv = process.env.ENV === 'prod' ? '' : '/api';

export const twitchIconDomain = "https://static-cdn.jtvnw.net";

export enum E_Item_Types {
    All = "All",
    WEAPONS = "Weapons",
    TOOLS = "Tools",
    CONSUMABLES = "Consumables",
} 

export const ItemTypes = Object.values(E_Item_Types);
