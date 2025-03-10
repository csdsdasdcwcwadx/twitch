'use client';

import { Fragment, useEffect, useState } from "react";
import { getRedemption, updateRedemptions } from "@/utils/api";
import { I_Redemption } from "@/utils/interface";
import { ImagePath } from "@/utils/util";
import Image from "next/image";
import { Button } from "@headlessui/react";

export default function Exchange () {
    const [redemptions, setRedemptions] = useState<I_Redemption[]>([]);

    useEffect(() => {
        (async function () {
            try {
                const result = await getRedemption();
                setRedemptions(result.getRedemptions);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])
    return (
        <main>
            <h1 className="font-bold text-2xl block text-center pb-[10px] w-[90%] m-auto mt-8">禮品兌換紀錄</h1>
            <table className="m-auto w-[90%]">
                <thead className="border-b border-solid border-foreground">
                    <tr>
                        <td className="p-[10px] text-center cursor-pointer w-[20%]">物品</td>
                        <td className="p-[10px] text-center cursor-pointer">用戶名稱</td>
                        <td className="p-[10px] text-center cursor-pointer">數量</td>
                        <td className="p-[10px] text-center cursor-pointer">名稱</td>
                        <td className="p-[10px] text-center cursor-pointer">日期</td>
                        <td className="p-[10px] text-center cursor-pointer">狀態</td>
                    </tr>
                </thead>
                <tbody>
                {
                    redemptions.map(redemption => {
                        const date = new Date(Number(redemption.created_at));
                        const formattedDate = date.toISOString().split("T")[0];

                        return (
                            <tr key={redemption.id}>
                                <td className="p-[10px]">
                                    <figure className="relative rounded aspect-[1.5]">
                                    {
                                        redemption.item.image ? <Image src={ImagePath + redemption.item.image} alt={redemption.item.name} className="object-cover rounded" fill sizes="100"/>
                                        : <></>
                                    }
                                    </figure>
                                </td>
                                <td className="p-[10px] text-center">{redemption.user.name}</td>
                                <td className="p-[10px] text-center">{redemption.amount}</td>
                                <td className="p-[10px] text-center">{redemption.item.name}</td>
                                <td className="p-[10px] text-center">{formattedDate}</td>
                                <td className="p-[10px] text-center">
                                    {
                                        redemption.status ? 
                                            <span>已兌換</span> : 
                                            <Button 
                                                className="text-topcovercolor rounded-md py-2.5 px-3 bg-coverground"
                                                onClick={async () => {
                                                    if (!confirm("是否要兌換禮品")) return;
                                                    const result = await updateRedemptions(redemption.id, true);
                                                    if (result.status) {
                                                        const result = await getRedemption();
                                                        setRedemptions(result.getRedemptions);
                                                    }
                                                    alert(result.message);
                                                }}
                                            >尚未兌換</Button>
                                    }
                                </td>
                                <td></td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </main>
    )
}