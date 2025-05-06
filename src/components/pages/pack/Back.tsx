"use client";

import { useState, useMemo, useEffect } from "react";

import { I_Item, E_Item_Types, I_BackPackPage } from "@/utils/interface";
import { getbackpacks } from "@/utils/api";
import { pagesize } from "@/utils/util";

import PageNumber from "@/components/common/PageNumber";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import ItemGrid from "./ItemGrid";
import ItemDialog from "./ItemDialog";
import UserItemDialog from "./UserItemDialog";

interface I_props {
    packData: I_BackPackPage;
}

export default function Pack({ packData }: I_props) {
    const [selectedItem, setSelectedItem] = useState<I_Item | null>(null);
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [openDialog, setOpenDialog] = useState(false);
    const [openItemSettingDialog, setOpenItemSettingDialog] = useState<I_Item | null>(null);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<I_BackPackPage>({
        getItems: packData.getItems,
        getAllUsers: packData.getAllUsers,
        getItemPages: packData.getItemPages,
    });

    useEffect(() => {
        (async function () {
            try {
                const result = await getbackpacks(page, pagesize);
                setData(result);
            } catch(e) {
                console.log(e)
            }
        })()
    }, [page])

    useEffect(() => {
        if (selectedItem) setOpenDialog(true);
    }, [selectedItem])

    useEffect(() => {
        if (!openDialog) setSelectedItem(null);
    }, [openDialog])

    const filterItemCheck = useMemo(() => {
        // 如果沒有 `query` 和 `currentType`，直接返回所有項目
        if (query === "" && currentType === E_Item_Types.All) return data.getItems;
      
        return data.getItems.filter((item) => {
          // 檢查名稱是否匹配 `query`
          const matchesQuery = query === "" || item.name.toLowerCase().includes(query.toLowerCase());
          // 檢查類型是否匹配 `currentType`
          const matchesType = currentType === "All" || item.type === currentType;
      
          return matchesQuery && matchesType;
        });
    }, [query, currentType, data]);
  
    return (
        <main className="pc:flex h-screen mobile:w-[100%]">
            <SideBar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery} setOpenDialog={setOpenDialog}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} setOpenDialog={setSelectedItem} setOpenItemSettingDialog={setOpenItemSettingDialog}/>
                    </div>
                </div>
                <div className="mt-8">
                    <PageNumber maxpage={data.getItemPages} serial={page} setSerial={setPage}/>
                </div>
            </div>
            <ItemDialog setOpenDialog={setOpenDialog} openDialog={openDialog} selectedItem={selectedItem} setData={setData} page={page}/>
            <UserItemDialog selectedItem={openItemSettingDialog} setSelectedItem={setOpenItemSettingDialog} data={data} setData={setData} page={page}/>
        </main>
    );
};