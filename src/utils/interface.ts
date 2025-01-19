export type I_Check = {
    id: string;
    streaming: boolean;
    created_at: string;
    userChecks: I_UserCheck[];
}

export type I_UserCheck = {
    user_id: string;
    check_id: string;
    checked: boolean;
    created_at: string;
}

export type I_User = {
    id: string
    twitch_id: string
    login: string
    name: string
    email: string
    profile_image: string
}

export type I_CheckPage = {
    getChecks: I_Check[];
    getUsers: I_User[];
}