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
}

export const pageCheck = async () => {
    const GET_ALL_CHECKS = gql`
        query GetAllChecks {
            getChecks {
                id
                passcode
                created_at
            }
        }
    `;
    apollo
        .query({ query: GET_ALL_CHECKS })
        .then(response => console.log(response.data))
        .catch(err => console.error(err));
}