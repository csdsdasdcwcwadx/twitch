'use client';

import { Fragment, useEffect, useState } from "react";
import { getRedemption } from "@/utils/api";
import { I_Redemption } from "@/utils/interface";
import { ImagePath } from "@/utils/util";
import Image from "next/image";
import PageNumber from "@/components/common/PageNumber";

export default function Exchange () {
    const [redemptions, setRedemptions] = useState<I_Redemption[]>([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        (async function () {
            try {
                const result = await getRedemption();
                setRedemptions(result.getRedemptions);
                setMaxPage(result.getRedemptionPages);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [])
    return (
        <main>
            <h1 className="font-bold text-2xl block text-center pb-[10px] w-[90%] m-auto mt-8">禮品兌換紀錄</h1>
            <div className="m-auto w-[90%] table mobile:block">
                <div className="border-b border-solid border-foreground table-header-group mobile:hidden">
                    <div className="table-row">
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold w-[20%]">物品</div>
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold">數量</div>
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold">名稱</div>
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold">日期</div>
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold">狀態</div>
                    </div>
                </div>
                <div className="table-row-group mobile:block">
                {
                    redemptions.map((redemption, index: number) => {
                        const date = new Date(Number(redemption.created_at));
                        const formattedDate = date.toISOString().split("T")[0];
                        const className = [
                            "table-row",
                            "mobile:block",
                        ]
                        if (index) {
                            className.push("mobile:mt-5");
                        }

                        return (
                            <div key={redemption.id} className={className.join(" ")}>
                                <div className="p-[10px] table-cell mobile:block align-middle">
                                    <figure className="relative rounded aspect-[1.5] mobile:aspect-[3]">
                                    {
                                        redemption.item.image ? <Image src={ImagePath + redemption.item.image} alt={redemption.item.name} className="object-cover rounded" fill sizes="100"/>
                                        : <></>
                                    }
                                    </figure>
                                </div>
                                <div className="p-[10px] table-cell mobile:flex mobile:justify-between align-middle text-center">
                                    <span className="pc:hidden font-bold mr-5">數量</span>
                                    <span>{redemption.amount}</span>
                                </div>
                                <div className="p-[10px] table-cell mobile:flex mobile:justify-between align-middle text-center">
                                    <span className="pc:hidden font-bold mr-5">名稱</span>
                                    <span>{redemption.item.name}</span>
                                </div>
                                <div className="p-[10px] table-cell mobile:flex mobile:justify-between align-middle text-center">
                                    <span className="pc:hidden font-bold mr-5">日期</span>
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="p-[10px] table-cell mobile:block align-middle text-center">
                                    <span className="pc:hidden font-bold mr-5">狀態</span>
                                    <span>{redemption.status ? "已兌換" : "尚未兌換"}</span>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            <div className="mt-8">
                <PageNumber maxpage={maxPage} serial={page} setSerial={setPage}/>
            </div>
        </main>
    )
}