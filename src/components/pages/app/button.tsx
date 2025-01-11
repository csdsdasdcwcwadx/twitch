'use client';
import { useEffect } from "react";
import { login } from "@/utils/api";

function LoginButton () {
    useEffect(() => {
        (async function() {
            try {
                const data = await login();
                if (data.status) {
                    window.location.href = data.href;
                }
            } catch (e: unknown) {
                console.log(e)
            }
        })()
    }, [])

    return (
        <button
            className="bg-[#f1b600] py-5 px-10 pl-10 font-bold text-background tracking-widest text-[17px] rounded-[20px] mx-auto block"
            onClick={() => {
                const clientId = "lfirafgpkknrzxg6412jb9y8u5nd34";
                const redirectUri = "http://localhost:4000/login";
                const scope = "user:read:email";
                const force_verify = true;
                const login_type = 'login';
                
                const twitchLoginUrl = 'https://id.twitch.tv/oauth2/authorize?' +
                    `client_id=${clientId}` +
                    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                    `&response_type=code` +
                    `&scope=${encodeURIComponent(scope)}` +
                    `&force_verify=${force_verify}` +
                    `&login_type=${login_type}`;
                
                // 使用者按下按鈕進行登入
                window.location.href = twitchLoginUrl;
            }}
        >
            登入
        </button>
    )
}

export default LoginButton;