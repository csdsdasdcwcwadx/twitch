'use client';

function LoginButton () {
    https://id.twitch.tv/oauth2/authorize?
    // client_id=d6g6o112aam5s8q2di888us9o3kuyh
    // &force_verify=true
    // &lang=zh-tw
    // &login_type=login
    // &redirect_uri=https%3A%2F%2Fwww.twitch.tv%2Fpassport-callback
    // &response_type=token
    // &scope=user_read
    // &state=%7B%22origin%22%3A%22full_page%22%2C%22next%22%3A%22https%3A%2F%2Fdev.twitch.tv%2Flogin%22%2C%22nonce%22%3A%228b78dd7416e62e2811d9242faff174ea%22%7D
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