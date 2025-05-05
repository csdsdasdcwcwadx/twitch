import axios from "axios";
import { domainEnv, isServerSide, getServerCookies } from "./util";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { I_CheckPage, I_Header, I_BackPackPage, I_ExchangePage } from "./interface";

const api = axios.create({
    baseURL: domainEnv, // 確保後端的 API URL 從環境變量中獲取
    withCredentials: true, // 允許攜帶 cookies
});

const apollo = new ApolloClient({
    uri: `${domainEnv}/graphql`,
    cache: new InMemoryCache(),
});

export const login = async (path = "") => {
    const response = await api.get(path);
    return response.data;
};

export const setcheck = async (passcode: string) => {
    const response = await api.post("/check/addcheck", {
        passcode,
    });
    return response.data;
};

export const setUserCheck = async(checkId: string, isChecked: boolean, passcode: string) => {
    const response = await api.post("/usercheck/sign", {
        checkId,
        isChecked,
        passcode,
    });
    return response.data;
};

export const logout = async () => {
    const response = await api.get("/member/logout");
    return response.data;
};

export const setCheckStatus = async(checkId: string, streaming: boolean) => {
    const response = await api.post("/check/updatecheckstatus", {
        checkId,
        streaming,
    });
    return response.data;
};

export const setItem = async(name: string, type: string, description: string, amount: string, image?: File, id?: string, imageName?: string) => {
    const formData = new FormData();
    formData.append('image', image!);
    formData.append("name", name);
    formData.append("type", type);
    formData.append("amount", amount.toString());
    formData.append("description", description);
    if (imageName) formData.append("existimagename", imageName);

    const response = await api.post("/item/additem", formData, {
        params: id ? { id } : undefined,
    });
    return response.data;
};

export const deleteItem = async(existimagename: string, id: string) => {
    const response = await api.post("/item/deleteItem", {
        existimagename,
    }, {
        params: id ? { id } : undefined,
    });
    return response.data;
};

export const addUserItem = async(userId: string, itemId: string, amount: number) => {
    const response = await api.post("/useritem/ownitem", {
        userId,
        itemId,
        amount,
    })
    return response.data;
};

export const exchange = async(itemId: string, amount: number, realname: string, address: string, phone: string) => {
    const response = await api.post("/redemp/exchange", {
        itemId,
        amount,
        realname,
        address,
        phone,
    })
    return response.data;
};

export const updateRedemptions = async(redemptionId: string, status: boolean) => {
    const response = await api.post("/redemp/update", {
        redemptionId,
        status,
    })
    return response.data;
};

// -----------------------------------------graphQL-----------------------------------------

export const getUsers = async () => {
    const headers: Record<string, string> = {};
    if (isServerSide) {
        const allCookies = await getServerCookies();
        headers.cookie = allCookies;
    }
    const GET_USER_CHECKS = gql`
        query GetHeader {
            getUsers {
                id
                twitch_id
                login
                name
                email
                profile_image
                realname
                address
                phone
            }
        }
    `;
    const response = await apollo.query<I_Header>({
        query: GET_USER_CHECKS,
        context: { headers },
    });
    return response.data;
};

export const getchecks = async (year?: string, month?: string) => {
    const headers: Record<string, string> = {};
    if (isServerSide) {
        const allCookies = await getServerCookies();
        headers.cookie = allCookies;
    }
    const GET_USER_CHECKS = gql`
        query GetAllChecks($year: String, $month: String) {
            getChecks(year: $year, month: $month) {
                id
                streaming
                created_at
                userChecks {
                    checked
                    created_at
                }
            }
        }
    `;

    const response = await apollo.query<I_CheckPage>({
        query: GET_USER_CHECKS,
        variables: { year, month },
        fetchPolicy: "no-cache",
        context: { headers },
    });
    return response.data;
};

export const getpacks = async (page = 1, pageSize = 10) => {
    const headers: Record<string, string> = {};
    if (isServerSide) {
        const allCookies = await getServerCookies();
        headers.cookie = allCookies;
    }
    const GET_USER_ITEMS = gql`
        query GetAllItems($page: Int, $pageSize: Int) {
            getItems(page: $page, pageSize: $pageSize) {
                id
                name
                image
                description
                created_at
                type
                amount
                userItems {
                    amount
                    created_at
                }
            }
            getItemPages(pageSize: $pageSize)
        }
    `;

    const response = await apollo.query<I_BackPackPage>({
        query: GET_USER_ITEMS,
        variables: { page, pageSize },
        fetchPolicy: "no-cache",
        context: { headers },
    });
    return response.data;
};

export const getRedemption = async (page = 1, pageSize = 10) => {
    const GET_REDEMPTION = gql`
        query GetAllItems($page: Int, $pageSize: Int) {
            getRedemptions(page: $page, pageSize: $pageSize) {
                id
                amount
                created_at
                status
                item {
                    name
                    type
                    id
                    image
                    description
                    amount
                    created_at
                }
                user {
                    id
                    twitch_id
                    login
                    name
                    email
                    profile_image
                }
            }
            getRedemptionPages(pageSize: $pageSize)
        }
    `;

    const response = await apollo.query<I_ExchangePage>({
        query: GET_REDEMPTION,
        variables: { page, pageSize },
        fetchPolicy: "no-cache",
    });
    return response.data;
};

export const getbackchecks = async (year?: string, month?: string) => {
    const headers: Record<string, string> = {};
    if (isServerSide) {
        const allCookies = await getServerCookies();
        headers.cookie = allCookies;
    }
    const GET_USER_CHECKS = gql`
        query GetAllChecks($year: String, $month: String) {
            getChecks(year: $year, month: $month) {
                id
                streaming
                created_at
                passcode
                userChecks {
                    user {
                        id
                        twitch_id
                        login
                        name
                        email
                        profile_image
                    }
                    checked
                    created_at
                }
            }
        }
    `;

    const response = await apollo.query<I_CheckPage>({
        query: GET_USER_CHECKS,
        variables: { year, month },
        fetchPolicy: "no-cache",
        context: { headers },
    });
    return response.data;
};

export const getbackpacks = async (page = 1, pageSize = 10) => {
    const headers: Record<string, string> = {};
    if (isServerSide) {
        const allCookies = await getServerCookies();
        headers.cookie = allCookies;
    }
    const GET_USER_ITEMS = gql`
        query GetAllItems($page: Int, $pageSize: Int) {
            getItems(page: $page, pageSize: $pageSize) {
                id
                name
                image
                description
                created_at
                type
                amount
                userItems {
                    user {
                        id
                        twitch_id
                        login
                        name
                        email
                        profile_image
                    }
                    amount
                    created_at
                }
            }
            getAllUsers {
                id
                twitch_id
                login
                name
                email
                profile_image
            }
            getItemPages(pageSize: $pageSize)
        }
    `;

    const response = await apollo.query<I_BackPackPage>({
        query: GET_USER_ITEMS,
        variables: { page, pageSize },
        fetchPolicy: "no-cache",
        context: { headers },
    });
    return response.data;
};