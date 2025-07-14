"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

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
    const [items, setItems] = useState<I_Item[]>(packData.getItems);

    const pageChange = useCallback(async (page: number) => {
        const result = await getbackpacks(page, pagesize);
        if (result.payload) setItems(result.payload.getItems);
        setPage(page);
    }, []);

    useEffect(() => {
        if (selectedItem) setOpenDialog(true);
    }, [selectedItem])

    useEffect(() => {
        if (!openDialog) setSelectedItem(null);
    }, [openDialog])

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
                <SearchBar setQuery={setQuery} setOpenDialog={setOpenDialog}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} setOpenDialog={setSelectedItem} setOpenItemSettingDialog={setOpenItemSettingDialog}/>
                    </div>
                </div>
                <div className="mt-8">
                    <PageNumber maxpage={packData.getItemPages} serial={page} setSerial={pageChange}/>
                </div>
            </div>
            <ItemDialog setOpenDialog={setOpenDialog} openDialog={openDialog} selectedItem={selectedItem} setItems={setItems} page={page}/>
            <UserItemDialog selectedItem={openItemSettingDialog!} setSelectedItem={setOpenItemSettingDialog} setItems={setItems} page={page} allUsers={packData.getAllUsers}/>
        </main>
    );
};