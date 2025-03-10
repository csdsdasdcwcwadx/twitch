'use client';

import { useState, useMemo, useEffect } from "react";
import { Input, Button } from "@headlessui/react";
import { ItemTypes, ImagePath } from "@/utils/util";
import { I_Item, E_Item_Types } from "@/utils/interface";
import Image from "next/image";
import { getpacks } from "@/utils/api";
import CustomDialog from "@/components/common/CustomDialog";
import plusIcon from "@/icon/plus.png";
import minusIcon from "@/icon/minus.png";
import { exchange } from "@/utils/api";

interface I_SideBarProps {
    setCurrentType: (category: E_Item_Types) => void;
}

interface I_SearchBarProps {
    setQuery: (value: string) => void;
}

interface I_ItemGridProps {
    items: I_Item[];
    openDialog: I_Item | null;
    setOpenDialog: (flag: I_Item | null) => void;
}

interface I_ItemDialogProps {
    openDialog: I_Item | null;
    setOpenDialog: (flag: I_Item | null) => void;
    setItems: (items: I_Item[]) => void;
}

export default function Pack() {
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [items, setItems] = useState<I_Item[]>([]);
    const [openDialog, setOpenDialog] = useState<I_Item | null>(null);

    useEffect(() => {
        (async function () {
            try {
                const result = await getpacks();
                setItems(result.getItems);
            } catch(e) {
                console.log(e)
            }
        })()
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
        <main className="pc:flex h-screen mobile:w-[100%]">
            <Sidebar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} openDialog={openDialog} setOpenDialog={setOpenDialog}/>
                    </div>
                </div>
            </div>
            <ItemDialog setOpenDialog={setOpenDialog} openDialog={openDialog} setItems={setItems}/>
        </main>
    );
};

const Sidebar = ({ setCurrentType }: I_SideBarProps) => {
    return (
        <div className="pc:w-1/5 bg-coverground p-4 overflow-x-auto">
            <h2 className="text-xl text-topcovercolor font-bold mb-4 mobile:text-center">Categories</h2>
            <ul className="mobile:flex mobile:justify-around">
                {ItemTypes.map((category) => (
                    <li key={category} className="mobile:text-center mobile:flex-auto mb-2 text-topcovercolor cursor-pointer hover:bg-hoverground p-3" onClick={() => setCurrentType(category)}>
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SearchBar = ({ setQuery }: I_SearchBarProps) => {
    return (
        <div className="mb-4 flex mobile:flex-col">
            <Input
                type="text"
                placeholder="搜尋物品"
                className="w-[100%] p-2 rounded shadow border border-solid border-slate-500 outline-none"
                onChange={(event) => setQuery(event.target.value)}
            />
        </div>
    );
};

const ItemGrid = ({ items, setOpenDialog }: I_ItemGridProps) => {
    return (
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mobile:grid-cols-1">
            {items.map((item) => {
                if (!item.userItems?.length) return;
                return (
                    <div
                        key={item.id}
                        className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 min-h-[350px] pc:min-h-[250px] aspect-1 relative"
                        onClick={() => setOpenDialog(item)}
                    >
                        <figure className="relative h-16 cursor-pointer transform h-[50%] rounded">
                            {
                                item.image ? <Image src={ImagePath + item.image} alt={item.name} className="object-cover rounded" fill sizes="100"/>
                                : <></>
                            }
                        </figure>
                        <h3 className="text-lg font-semibold mt-3 mobile:text-center mobile:text-3xl">{item.name}</h3>
                        <p className="text-sm text-foreground text-lg mobile:text-center">{item.description}</p>
                        <div className="mobile:absolute bottom-[2rem]">
                            <div>兌換數量 : {item.amount}</div>
                            <div>持有數量 : {item.userItems[0]?.amount}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

const ItemDialog = ({ openDialog, setOpenDialog, setItems }: I_ItemDialogProps) => {
    const [value, setValue] = useState(0);

    const increase = () => setValue((prev) => prev + 1);
    const decrease = () => setValue((prev) => Math.max(0, prev - 1)); // 避免負數

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
          setValue(newValue);
        }
    };
    if (!openDialog) return null;

    return (
        <CustomDialog open={Boolean(openDialog)} close={() => setOpenDialog(null)} title={`${openDialog.name}兌換數量`}>
            <section>
                <div className="flex justify-center mt-5">
                    <i className="block w-[30px] h-[30px] cursor-pointer" onClick={decrease}>
                        <Image src={minusIcon} alt="arrow-down" className="absolute"/>
                    </i>
                    <Input value={value} type="number" className="text-lg outline-none px-2 border-slate-500 w-[50px] text-center pointer-events-none" onChange={handleChange}/>
                    <i className="block w-[30px] h-[30px] cursor-pointer"  onClick={increase}>
                        <Image src={plusIcon} alt="arrow-down" className="absolute"/>
                    </i>
                </div>
                <Button onClick={async () => {
                    const result = await exchange(openDialog.id, value*openDialog.amount);
                    if (result.status) {
                        const result = await getpacks();
                        setItems(result.getItems);
                    } else {
                        alert(result.message);
                    }
                    setOpenDialog(null);
                }} className="mt-3 m-auto block bg-coverground text-topcovercolor rounded p-4">送出</Button>
            </section>
        </CustomDialog>
    )
}