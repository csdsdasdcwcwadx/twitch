"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { I_Item, I_PackPage, E_Item_Types } from "@/utils/interface";
import { getpacks } from "@/utils/api";
import PageNumber from "@/components/common/PageNumber";

import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import ItemGrid from "./ItemGrid";
import ExchangeDialog from "./ExchangeDialog";
import { pagesize } from "@/utils/util";

interface I_props {
    packData: I_PackPage;
}

export default function Pack({ packData }: I_props) {
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [items, setItems] = useState<I_Item[]>(packData.getItems);
    const [openDialog, setOpenDialog] = useState<I_Item | null>(null);
    const [page, setPage] = useState(1);
    const [params, setParams] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const storeaddress = searchParams.get('storeaddress');

        if (storeaddress) {
            setParams(storeaddress);
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, [])

    const pageChange = useCallback(async (page: number) => {
        const result = await getpacks(page, pagesize);
        if (result.payload) setItems(result.payload.getItems);
        setPage(page);
    }, []);

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
        <main className="pc:flex h-screen mobile:w-[100%]">
            <SideBar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery}/>
                <div className="flex gap-6">
                    <div className="flex-1 max-w-[1500px] m-auto">
                        <ItemGrid items={filterItemCheck} setOpenDialog={setOpenDialog}/>
                    </div>
                </div>
                <div className="mt-8">
                    <PageNumber maxpage={packData.getItemPages} serial={page} setSerial={pageChange}/>
                </div>
            </div>
            <ExchangeDialog setOpenDialog={setOpenDialog} openDialog={openDialog} setItems={setItems} page={page} storeaddress={params}/>
        </main>
    );
};