export type I_Check = {
    id: string;
    streaming: boolean;
    created_at: string;
    userChecks: I_UserCheck[];
}

export type I_UserCheck = {
    user: I_User;
    check_id: string;
    checked: boolean;
    created_at: string;
}

export type I_User = {
    id: string;
    twitch_id: string;
    login: string;
    name: string;
    email: string;
    profile_image: string;
}

export enum E_Item_Types {
    All = "All",
    WEAPONS = "Weapons",
    TOOLS = "Tools",
    CONSUMABLES = "Consumables",
} 

export type I_Item = {
    id: string;
    name: string;
    image: string;
    type: E_Item_Types;
    description: string;
    userItems?: I_UserItem[];
}

export type I_UserItem = {
    user: I_User;
    item: string;
    amount: number;
    created_at: string;
}

export type I_CheckPage = {
    getChecks: I_Check[];
}

export type I_Header = {
    getUsers: I_User;
}

export type I_PackPage = {
    getItems: I_Item[];
}