import axios from "axios";
import { domainEnv } from "./util";
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
    const response = await api.post("/twitch/check/addcheck", {
        passcode,
    });
    return response.data;
};

export const setUserCheck = async(checkId: string, isChecked: boolean, passcode: string) => {
    const response = await api.post("/twitch/usercheck/sign", {
        checkId,
        isChecked,
        passcode,
    });
    return response.data;
};

export const logout = async () => {
    const response = await api.get("/twitch/member/logout");
    return response.data;
};

export const setCheckStatus = async(checkId: string, streaming: boolean) => {
    const response = await api.post("/twitch/check/updatecheckstatus", {
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

    const response = await api.post("/twitch/item/additem", formData, {
        params: id ? { id } : undefined,
    });
    return response.data;
}

export const deleteItem = async(existimagename: string, id: string) => {
    const response = await api.post("/twitch/item/deleteItem", {
        existimagename,
    }, {
        params: id ? { id } : undefined,
    });
    return response.data;
}

export const addUserItem = async(userId: string, itemId: string, amount: number) => {
    const response = await api.post("/twitch/useritem/ownitem", {
        userId,
        itemId,
        amount,
    })
    return response.data;
}

export const exchange = async(itemId: string, amount: number) => {
    const response = await api.post("/twitch/redemp/exchange", {
        itemId,
        amount,
    })
    return response.data;
}

export const updateRedemptions = async(redemptionId: string, status: boolean) => {
    const response = await api.post("/twitch/redemp/update", {
        redemptionId,
        status,
    })
    return response.data;
}

// -----------------------------------------graphQL-----------------------------------------

export const getUsers = async () => {
    const GET_USER_CHECKS = gql`
        query GetAllChecks {
            getUsers {
                id
                twitch_id
                login
                name
                email
                profile_image
            }
        }
    `;
    const response = await apollo.query<I_Header>({
        query: GET_USER_CHECKS,
    });
    return response.data;
}

export const getchecks = async () => {
    const GET_USER_CHECKS = gql`
        query GetAllChecks {
            getChecks {
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
        fetchPolicy: "no-cache",
    });
    return response.data;
};

export const getbacks = async () => {
    const GET_USER_CHECKS = gql`
        query GetAllChecks {
            getChecks {
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
            getUsers {
                id
                twitch_id
                login
                name
                email
                profile_image
            }
        }
    `;

    const response = await apollo.query<I_CheckPage>({
        query: GET_USER_CHECKS,
        fetchPolicy: "no-cache",
    });
    return response.data;
}

export const getbackpacks = async () => {
    const GET_USER_ITEMS = gql`
        query GetAllItems {
            getItems {
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
        }
    `;

    const response = await apollo.query<I_BackPackPage>({
        query: GET_USER_ITEMS,
        fetchPolicy: "no-cache",
    });
    return response.data;
}

export const getpacks = async () => {
    const GET_USER_ITEMS = gql`
        query GetAllItems {
            getItems {
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
        }
    `;

    const response = await apollo.query<I_BackPackPage>({
        query: GET_USER_ITEMS,
        fetchPolicy: "no-cache",
    });
    return response.data;
}

export const getRedemption = async () => {
    const GET_REDEMPTION = gql`
        query GetAllItems {
            getRedemptions {
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
        }
    `;

    const response = await apollo.query<I_ExchangePage>({
        query: GET_REDEMPTION,
        fetchPolicy: "no-cache",
    });
    return response.data;
}