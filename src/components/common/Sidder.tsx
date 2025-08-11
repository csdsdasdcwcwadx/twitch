import { memo, useState } from "react";
import Image from "next/image";

import ecyayIcon from "@/images/ecpay.png";
import opayIcon from "@/images/opay.png";
import donateIcon from "@/icon/donate.png";

import { createOrder } from "@/utils/api";
import CustomDialog from "./CustomDialog";

const displayImages = [
    {
        src: ecyayIcon,
        alt: "ecpay",
    },
    {
        src: opayIcon,
        alt: "opay",
    },
]

function Sidder () {
    const [openDialog, setOpenDialog] = useState(false);
    
    const handleClick = async (alt: string) => {
        switch(alt) {
            case "ecpay":
            case "opay":
                // const formHtml = 
                //     `<form id="autoForm" action="https://payment-stage.opay.tw/Broadcaster/Donate/740F06A8DEBBE6566C8824D938FA403B" method="post" accept-charset="utf-8">` +
                //         `<input type="hidden" name="DonateNickName" value="測試用" />` +
                //         `<input type="hidden" name="DonateAmount" value="50" />` +
                //         `<input type="hidden" name="DonateMsg" value="測試用" />` +
                //         `<input type="hidden" name="ReturnURL" value="https://9d93f2b19c5e.ngrok-free.app/payment/paymentresult" />` +
                //     `</form>` + 
                //     `<script>` +
                //         `document.getElementById('autoForm').submit();` +
                //     `</script>`;
                const formHtml = await createOrder(alt);
                const container = document.createElement('div');
                container.innerHTML = formHtml;
                document.body.appendChild(container);

                const script = container.querySelector('script');
                if (script) {
                    eval(script.innerText);
                }
                break;
        }
    };

    return (
        <>
            <aside className="rounded-2xl w-[180px] h-[180px] fixed right-[10px] bottom-[50px] cursor-pointer z-[10]" onClick={() => setOpenDialog(true)}>
                <Image src={donateIcon} alt="donate" fill/>
            </aside>
            <CustomDialog title="選擇支付方式" open={openDialog} close={setOpenDialog}>
                <div className="flex justify-between">
                    {
                        displayImages.map(image => (
                            <figure key={image.alt} className="cursor-pointer" onClick={() => handleClick(image.alt)}>
                                <Image src={image.src} alt={image.alt}/>
                            </figure>
                        ))
                    }
                </div>
            </CustomDialog>
        </>
    );
}

export default memo(Sidder);