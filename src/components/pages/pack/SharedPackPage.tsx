"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { I_Item, E_Item_Types, I_BackPackPage, I_PackPage } from "@/utils/interface";
import { getbackpacks, getpacks } from "@/utils/api";
import { pagesize } from "@/utils/util";

import CommonPage from "@/components/common/CommonPage";
import PageNumber from "@/components/common/PageNumber";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import ItemGrid from "./ItemGrid";
import ItemDialog from "./ItemDialog";
import UserItemDialog from "./UserItemDialog";
import ExchangeDialog from "./ExchangeDialog";

interface I_props {
    packData: I_BackPackPage | I_PackPage;
    isAdmin: boolean;
}

export default function SharedTemplate({ packData, isAdmin }: I_props) {
    const [selectedItem, setSelectedItem] = useState<I_Item | null>(null);
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [openDialog, setOpenDialog] = useState(false);
    const [openItemSettingDialog, setOpenItemSettingDialog] = useState<I_Item | null>(null);
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<I_Item[]>(packData.getItems);
    const [params, setParams] = useState("");
    const [openExchangeDialog, setOpenExchangeDialog] = useState<I_Item | null>(null);

    const pageChange = useCallback(async (page: number) => {
        const result = isAdmin ? await getbackpacks(page, pagesize) : await getpacks(page, pagesize);
        if (result.payload) setItems(result.payload.getItems);
        setPage(page);
    }, [isAdmin]);

    useEffect(() => {
        if (selectedItem) setOpenDialog(true);
    }, [selectedItem])

    useEffect(() => {
        if (!openDialog) setSelectedItem(null);
    }, [openDialog])

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const storeaddress = searchParams.get('storeaddress');

        if (storeaddress) {
            setParams(storeaddress);
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, [])

    const filterItemCheck = useMemo(() => {
        // 如果沒有 `query` 和 `currentType`，直接返回所有項目
        if (query === "" && currentType === E_Item_Types.All) return items;
      
        return items.filter((item) => {
          // 檢查名稱是否匹配 `query`
          const matchesQuery = query === "" || item.name.toLowerCase().includes(query.toLowerCase());
          // 檢查類型是否匹配 `currentType`
          const matchesType = currentType === "All" || item.type === currentType;
      
          return matchesQuery && matchesType;
        });
    }, [query, currentType, items]);

    return (
        <CommonPage className="pc:flex">
            <div className="pc:flex w-[100%]">
                <SideBar setCurrentType={setCurrentType}/>
                <div className="flex-1 p-6 pc:flex flex-col">
                    <SearchBar setQuery={setQuery} setOpenDialog={isAdmin ? setOpenDialog : undefined}/>
                    <div className="flex gap-6 mb-5">
                        <div className="flex-1 pc:h-[780px]">
                            <ItemGrid items={filterItemCheck} setOpenDialog={isAdmin ? setSelectedItem : setOpenExchangeDialog} setOpenItemSettingDialog={isAdmin ? setOpenItemSettingDialog : undefined}/>
                        </div>
                    </div>
                    <PageNumber maxpage={packData.getItemPages} serial={page} setSerial={pageChange} className="mt-auto"/>
                </div>
            </div>
            {
                isAdmin ? <>
                    <ItemDialog
                        setOpenDialog={setOpenDialog}
                        openDialog={openDialog}
                        selectedItem={selectedItem}
                        setItems={setItems}
                        page={page}
                    />
                    <UserItemDialog
                        selectedItem={openItemSettingDialog!}
                        setSelectedItem={setOpenItemSettingDialog}
                        setItems={setItems}
                        page={page}
                        allUsers={"getAllUsers" in packData ? (packData as I_BackPackPage).getAllUsers : []}
                    />
                </> : <ExchangeDialog setOpenDialog={setOpenExchangeDialog} openDialog={openExchangeDialog} setItems={setItems} page={page} storeaddress={params}/>
            }
        </CommonPage>
    )
}
