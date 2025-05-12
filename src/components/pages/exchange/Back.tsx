"use client";

import { useCallback, useState } from "react";
import { getRedemption, updateRedemptions } from "@/utils/api";
import { I_Redemption, I_ExchangePage } from "@/utils/interface";
import { Button } from "@headlessui/react";
import PageNumber from "@/components/common/PageNumber";
import ImageHandler from "@/components/common/ImageHandler";
import { addressFilter, addressParser } from "@/utils/util";

interface I_props {
    exchangeData: I_ExchangePage;
}

export default function Exchange ({ exchangeData }: I_props) {
    const [redemptions, setRedemptions] = useState<I_Redemption[]>(exchangeData.getRedemptions);
    const [page, setPage] = useState(1);

    const pageChange = useCallback(async (page: number) => {
        const result = await getRedemption(page);
        if (result.payload) setRedemptions(result.payload.getRedemptions);
        setPage(page);
    }, []);

    return (
        <main>
            <h1 className="font-bold text-2xl block text-center pb-[10px] w-[90%] m-auto mt-8">禮品兌換紀錄</h1>
            <div className="m-auto w-[90%] table mobile:block">
                <div className="border-b border-solid border-foreground table-header-group mobile:hidden">
                    <div className="table-row">
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold w-[20%]">物品</div>
                        <div className="table-cell p-[10px] text-center cursor-pointer font-bold">用戶名稱</div>
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
                        const address = addressFilter(redemption.user.address);
                        const className = [
                            "table-row",
                            "mobile:block",
                        ]
                        if (index) className.push("mobile:mt-5");

                        return (
                            <div key={redemption.id} className={className.join(" ")}>
                                <div className="p-[10px] table-cell mobile:block align-middle">
                                    <figure className="relative rounded aspect-[1.5] mobile:aspect-[3]">
                                    {
                                        redemption.item.image ? <ImageHandler item={redemption.item}/> : <></>
                                    }
                                    </figure>
                                </div>
                                <div className="p-[10px] table-cell mobile:flex mobile:justify-between align-middle text-center">
                                    <span className="pc:hidden font-bold mr-5">用戶名稱</span>
                                    <div className="flex flex-col">
                                        <span>{redemption.user.name}</span>
                                        <span className="mt-2">{redemption.user.realname}</span>
                                        <span className="mt-2">{`(${addressParser(address.type)}) ${address.value.join(" ")}`}</span>
                                        <span className="mt-2">{redemption.user.phone}</span>
                                    </div>
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
                                                        if (result.payload) setRedemptions(result.payload.getRedemptions);
                                                    }
                                                    alert(result.message);
                                                }}
                                            >尚未兌換</Button>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            </div>
            <div className="mt-8">
                <PageNumber maxpage={exchangeData.getRedemptionPages} serial={page} setSerial={pageChange}/>
            </div>
        </main>
    )
}