'use client';

function LoginButton () {
    return (
        <button
            className="bg-[#f1b600] py-5 px-10 pl-10 font-bold text-background tracking-widest text-[17px] rounded-[20px] mx-auto block"
            onClick={() => {
                const clientId = "lfirafgpkknrzxg6412jb9y8u5nd34";
                const redirectUri = "http://localhost:4000/login";
                const scope = "user:read:email";
                
                const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
                  redirectUri
                )}&response_type=code&scope=${encodeURIComponent(scope)}`;
                
                // 使用者按下按鈕進行登入
                window.location.href = twitchLoginUrl;
            }}
        >
            登入
        </button>
    )
}

export default LoginButton;