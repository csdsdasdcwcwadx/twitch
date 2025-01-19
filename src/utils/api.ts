import axios from "axios";
import { domainEnv } from "./util";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

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
}

export const getchecks = async () => {
    // const GET_USER_CHECKS = gql`
    //     mutation GetUserChecks($userId: String!) {
    //         getUserChecks(userID: $userId) {
    //             user_id
    //             check_id
    //             checked
    //             created_at
    //         }
    //     }
    // `;

    // const response = await apollo.mutate({
    //     mutation: GET_USER_CHECKS,
    //     variables: { userId },
    // });
    const GET_USER_CHECKS = gql`
        query GetAllChecks {
            getChecks {
                id
                streaming
                created_at
                userChecks {
                    user_id
                    checked
                }
            }
        }
    `;

    const response = await apollo.query({
        query: GET_USER_CHECKS,
        fetchPolicy: "no-cache",
    });
    return response.data;
};