export type I_Check = {
    id: string;
    streaming: boolean;
    created_at: string;
    userChecks: I_UserCheck[];
};

export type I_UserCheck = {
    user: I_User;
    check_id: string;
    checked: boolean;
    created_at: string;
};

export type I_User = {
    id: string;
    twitch_id: string;
    login: string;
    name: string;
    email: string;
    profile_image: string;
    realname: string;
    phone: string;
    address: string;
    isGaming: boolean;
};

export enum E_Item_Types {
    All = "All",
    WEAPONS = "Weapons",
    TOOLS = "Tools",
    CONSUMABLES = "Consumables",
};

export enum E_AddressType {
    SEVEN = 0,
    POST = 1,
    PA = 2,
};

export type I_Item = {
    id: string;
    name: string;
    image: string;
    type: E_Item_Types;
    description: string;
    amount: number;
    userItems?: I_UserItem[];
};

export type I_Redemption = {
    id: string;
    user_id: string;
    item_id: string;
    amount: number;
    status: boolean;
    created_at: string;
    item: I_Item;
    user: I_User;
};

export type I_UserItem = {
    user: I_User;
    item: string;
    amount: number;
    created_at: string;
};

export type I_CheckPage = {
    getChecks: I_Check[];
};

export type I_Header = {
    getUsers: I_User;
};

export type I_PackPage = {
    getItems: I_Item[];
    getItemPages: number;
};

export type I_BackPackPage = {
    getItems: I_Item[];
    getAllUsers: I_User[];
    getItemPages: number;
};

export type I_ExchangePage = {
    getRedemptions: I_Redemption[];
    getRedemptionPages: number;
};

export enum E_WS_Type {
    MESSAGE = "MESSAGE",
    ACTION = "ACTION",
};

export type I_WS_Data = {
    type: E_WS_Type;
    payload: string;
}

export type I_Request<T> = {
    payload?: T;
    error?: string;
};