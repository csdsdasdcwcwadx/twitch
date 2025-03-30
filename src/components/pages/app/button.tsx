'use client';

function LoginButton () {

    return (
        <button
            className="bg-[#f1b600] py-5 px-10 pl-10 font-bold text-background tracking-widest text-[17px] rounded-[20px] mx-auto block"
            onClick={() => {
                const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
                const redirectUri = `${process.env.NEXT_PUBLIC_SERVER_HOST}/twitch/member/login`;
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