import Image from "next/image";
import React, { memo } from "react";
import avatarSrc from "@/icon/avatar.png";

function Inform () {
    return (
        <div className="flex flex-col justify-evenly mobile:justify-around items-center mr-5 ml-5 mobile:flex-row">
            <figure className="h-[160px] w-[160px] mt-15">
                <Image src={avatarSrc} alt="avatar"/>
            </figure>
            <p className="w-[250px] mobile:w-auto mobile:mt-5 text:foreground">
                <span className="block text-xl text-center font-bold mb-5">簽到說明</span>
                <span className="block text-center">在開放簽到欄位中點擊簽到並輸入通關密語即可完成簽到 </span>
                <span className="block text-center mt-3 mobile:mt-1">成功簽到可以領取道具 {'<'}天選之人{'>'} 卡牌</span> 
                <span className="block text-center mt-3 mobile:mt-1">累積30張兌換神秘禮物 !</span>
                <span className="block text-center mt-3 mobile:mt-1">通關密語在直播中不定時出現</span> 
                <span className="block text-center mt-3 mobile:mt-1">認真聽台、踴躍參與互動就會知道通關密語囉</span>
                <span className="block text-center mt-3 mobile:mt-1">簽到時間不定時關閉 大家可以早點來簽到</span>
                <span className="block text-center mt-3 mobile:mt-1">有問題歡迎在聊天室提問 thank you !</span>
            </p>
        </div>
    )
}

export default memo(Inform);