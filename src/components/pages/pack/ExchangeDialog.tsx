import { memo, useState, useEffect, useMemo } from "react";
import Image from "next/image";

import { useUserStore } from "@/stores/userStore";
import { Input, Button } from "@headlessui/react";
import { getpacks, exchange } from "@/utils/api";
import { domainEnv, pagesize } from "@/utils/util";
import { I_Item } from "@/utils/interface";

import plusIcon from "@/icon/plus.png";
import minusIcon from "@/icon/minus.png";
import seven_elevenIcon from "@/icon/seven_eleven.png";

import CustomDialog from "@/components/common/CustomDialog";
import RadioSelector from "@/components/common/RadioSelector";
import CheckBox from "@/components/common/CheckBox";
import InputBox, { E_RegexType } from "@/components/common/InputBox";

enum E_AddressType {
    SEVEN = 0,
    POST = 1,
    PA = 2,
}

interface I_props {
    openDialog: I_Item | null;
    setOpenDialog: (flag: I_Item | null) => void;
    setItems: (items: I_Item[]) => void;
    page: number;
    storeaddress: string | null;
}

function ExchangeDialog ({ openDialog, setOpenDialog, setItems, page, storeaddress }: I_props) {
    const [value, setValue] = useState(1);
    const [addressing, setAddressing] = useState<E_AddressType>(E_AddressType.PA);
    const [isSame, setIsSame] = useState(false);
    const userinfo = useUserStore((state) => state.user);

    const increase = () => setValue((prev) => prev + 1);
    const decrease = () => setValue((prev) => Math.max(1, prev - 1)); // 避免負數

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [postcal, setPostcal] = useState("");
    const [postOffice, setPostOffice] = useState("");
    const [seven, setSeven] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
          setValue(newValue);
        }
    };

    useEffect(() => {
        if (storeaddress) {
            setSeven(storeaddress);
            setAddressing(E_AddressType.SEVEN);
        }
        if (isSame) {
            if (userinfo?.realname) { // name
                setName(userinfo.realname);
            }
            if (userinfo?.phone) { // phone
                setPhone(userinfo.phone);
            }
            if (userinfo?.address) {
                const address_type = userinfo.address.split(":::")[0];
                const address_value = userinfo.address.split(":::")[1];

                switch (parseInt(address_type)) {
                    case E_AddressType.PA:
                        const postcal_PA = address_value.split("---")[0];
                        const address_PA = address_value.split("---")[1];

                        setAddressing(E_AddressType.PA);
                        setPostcal(postcal_PA);
                        setAddress(address_PA);
                        break;
                    case E_AddressType.POST:
                        setAddressing(E_AddressType.POST);
                        setPostOffice(address_value);
                        break;
                    case E_AddressType.SEVEN:
                        setAddressing(E_AddressType.SEVEN);
                        setSeven(address_value);
                        break;
                }
            }
        }
    }, [isSame, userinfo, storeaddress])

    const addressOptions = useMemo(() => {
        return Object.entries(E_AddressType)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => ({
                name: key,
                value: value as string
            }))
    }, [])

    if (!openDialog) return null;

    return (
        <CustomDialog open={Boolean(openDialog)} close={() => setOpenDialog(null)} title={`${openDialog.name}兌換數量`}>
            <section id="pack_itemdialog">
                <CheckBox title="與上次相同資料" value={isSame} onChange={setIsSame}/>
                <div className="">
                    <div>
                        <InputBox title="姓名" placeholder="請輸入姓名" type={E_RegexType.NAME} maxlength={10} value={name} onChange={setName}/>
                    </div>
                    <div>
                        <InputBox title="電話" placeholder="請輸入電話" type={E_RegexType.PHONE} maxlength={10} value={phone} onChange={setPhone}/>
                    </div>
                    <div>
                        <RadioSelector options={addressOptions} onChange={(value) => {setAddressing(value as E_AddressType)}} seleted={addressing}/>
                    </div>
                    <div className="flex items-center">
                        {
                            E_AddressType.PA === addressing ? <>
                                <InputBox title="郵遞區號" placeholder="請輸入郵遞區號" type={E_RegexType.NUMBER} maxlength={5} className="flex-1 mr-2" value={postcal} onChange={setPostcal}/>
                                <InputBox title="地址" placeholder="請輸入地址" type={E_RegexType.ADDRESS} maxlength={40} className="flex-[3]" value={address} onChange={setAddress}/>
                            </> :
                            E_AddressType.SEVEN === addressing ? <>
                                <figure className="h-10 relative w-10 cursor-pointer">
                                    <Image
                                        src={seven_elevenIcon} 
                                        alt="7-11"
                                        fill
                                        onClick={() => {
                                            const redirectUrl = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&servicetype=3&url=${domainEnv}/member/redirect&tempvar=${window.location.href}`;
                                            window.location.href = redirectUrl;
                                        }}
                                    />
                                </figure>
                                <span>{seven}</span>
                            </> :
                            E_AddressType.POST === addressing ? <>
                                <InputBox title="郵局" placeholder="請輸入郵局" type={E_RegexType.ADDRESS} maxlength={40} className="flex-[3]" value={postOffice} onChange={setPostOffice}/>
                            </> :
                            null
                        }
                    </div>
                    <div className="flex justify-center mt-5">
                        <i className="block w-[30px] h-[30px] cursor-pointer" onClick={decrease}>
                            <Image src={minusIcon} alt="arrow-down" className="absolute"/>
                        </i>
                        <Input value={value} type="number" className="text-lg outline-none px-2 border-slate-500 w-[50px] text-center pointer-events-none" onChange={handleChange}/>
                        <i className="block w-[30px] h-[30px] cursor-pointer"  onClick={increase}>
                            <Image src={plusIcon} alt="arrow-down" className="absolute"/>
                        </i>
                    </div>
                </div>
                <Button onClick={async () => {
                    const errormessage = document.querySelector("#pack_itemdialog .errormessage");

                    if (!errormessage) {
                        const addressPost = 
                            addressing === E_AddressType.PA ? `${E_AddressType.PA}:::${postcal}---${address}` : 
                            addressing === E_AddressType.POST ? `${E_AddressType.POST}:::${postOffice}` : 
                            addressing === E_AddressType.SEVEN ? `${E_AddressType.SEVEN}:::${seven}` : 
                            "";

                        const result = await exchange(
                            openDialog.id,
                            value*openDialog.amount,
                            name,
                            addressPost,
                            phone
                        );

                        if (result.status) {
                            const result = await getpacks(page, pagesize);
                            if (result.payload) setItems(result.payload.getItems);
                        }
                        alert(result.message);
                        setOpenDialog(null);
                    } else alert(errormessage.textContent);
                }} className="mt-3 m-auto block bg-coverground text-topcovercolor rounded p-4">送出</Button>
            </section>
        </CustomDialog>
    )
}

export default memo(ExchangeDialog);