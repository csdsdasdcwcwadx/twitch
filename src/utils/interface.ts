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

export type I_CheckPage = {
    getChecks: I_Check[];
}

export type I_Header = {
    getUsers: I_User;
}