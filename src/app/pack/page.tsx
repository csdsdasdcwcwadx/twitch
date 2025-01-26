'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import { Input, Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ItemTypes, ImagePath } from "@/utils/util";
import { I_Item, E_Item_Types } from "@/utils/interface";
import Image from "next/image";
import CustomDialog from "@/components/common/CustomDialog";
import Inputfile from "@/components/common/Inputfile";
import { getpacks, setItem } from "@/utils/api";

// const items: I_Item[] = [
//     { id: '1', name: "Sword", description: "A sharp blade.", image: "/sword.png", type: E_Item_Types.WEAPONS },
//     { id: '2', name: "Shield", description: "A sturdy shield.", image: "/shield.png", type: E_Item_Types.TOOLS },
//     { id: '3', name: "Potion", description: "Restores health.", image: "/potion.png", type: E_Item_Types.CONSUMABLES },
//     { id: '4', name: "Bow", description: "A ranged weapon.", image: "/bow.png", type: E_Item_Types.WEAPONS },
//     { id: '5', name: "Hammer", description: "A tool for construction.", image: "/hammer.png", type: E_Item_Types.TOOLS },
//     { id: '6', name: "Bandage", description: "Heals minor wounds.", image: "/bandage.png", type: E_Item_Types.CONSUMABLES },
//     { id: '7', name: "Dagger", description: "A small, sharp knife.", image: "/dagger.png", type: E_Item_Types.WEAPONS },
//     { id: '8', name: "Axe", description: "Chops wood effectively.", image: "/axe.png", type: E_Item_Types.TOOLS },
//     { id: '9', name: "Magic Scroll", description: "Contains a powerful spell.", image: "/scroll.png", type: E_Item_Types.CONSUMABLES },
//     { id: '10', name: "Crossbow", description: "A precise ranged weapon.", image: "/crossbow.png", type: E_Item_Types.WEAPONS },
//     { id: '11', name: "Wrench", description: "Used for mechanical repairs.", image: "/wrench.png", type: E_Item_Types.TOOLS },
//     { id: '12', name: "Herbs", description: "Used in healing potions.", image: "/herbs.png", type: E_Item_Types.CONSUMABLES },
//     { id: '13', name: "Lance", description: "A long, sharp weapon.", image: "/lance.png", type: E_Item_Types.WEAPONS },
//     { id: '14', name: "Saw", description: "Used for cutting wood.", image: "/saw.png", type: E_Item_Types.TOOLS },
//     { id: '15', name: "Elixir", description: "Grants temporary strength.", image: "/elixir.png", type: E_Item_Types.CONSUMABLES },
// ];

interface I_SideBarProps {
    setCurrentType: (category: E_Item_Types) => void;
}

interface I_SearchBarProps {
    setQuery: (value: string) => void;
    setOpenDialog: (flag: boolean) => void;
}

interface I_ItemGridProps {
    items: I_Item[];
    onSelectItem: (item: I_Item | null) => void;
}

interface I_ItemDialog {
    openDialog: boolean;
    setOpenDialog: (flag: boolean) => void;
    selectedItem: I_Item | null;
}

export default function Pack() {
    const [selectedItem, setSelectedItem] = useState<I_Item | null>(null);
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [openDialog, setOpenDialog] = useState(false);
    const [items, setItems] = useState<I_Item[]>([]);

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
            <Sidebar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery} setOpenDialog={setOpenDialog}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} onSelectItem={setSelectedItem} />
                    </div>
                </div>
            </div>
            <ItemDialog setOpenDialog={setOpenDialog} openDialog={openDialog} selectedItem={selectedItem}/>
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

const SearchBar = ({ setQuery, setOpenDialog }: I_SearchBarProps) => {
    return (
        <div className="mb-4 flex mobile:flex-col">
            <Input
                type="text"
                placeholder="搜尋物品"
                className="pc:w-[90%] p-2 rounded shadow border border-solid border-slate-500 outline-none pc:mr-5"
                onChange={(event) => setQuery(event.target.value)}
            />
            <Button className="pc:w-[10%] bg-coverground text-topcovercolor rounded-md w-7 mobile:m-auto mobile:mt-3 mobile:h-[50px] mobile:w-[110px]" onClick={() => setOpenDialog(true)}>新增物品</Button>
        </div>
    );
};

const ItemGrid = ({ items, onSelectItem }: I_ItemGridProps) => {
    return (
        <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 min-h-[200px] aspect-1"
                    onClick={() => onSelectItem(item)}
                >
                    <figure className="relative h-16 cursor-pointer transform h-[50%] rounded">
                        {
                            item.image ? <Image src={ImagePath + item.image} alt={item.name} className="object-cover rounded" fill sizes="100"/>
                            : <></>
                        }
                    </figure>
                    <h3 className="text-lg font-semibold mt-3 mobile:text-center mobile:text-3xl">{item.name}</h3>
                    <p className="text-sm text-foreground text-lg mobile:text-center">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

const ItemDialog = ({ openDialog, setOpenDialog, selectedItem }: I_ItemDialog) => {
    const [selected, setSelected] = useState(E_Item_Types.All);
    const [image, setImage] = useState<File>();
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedItem) {
            setSelected(selectedItem.type);
            setTimeout(() => {
                if (nameRef.current) {
                    nameRef.current.value = selectedItem.name;
                }
                if (descriptionRef.current) {
                    descriptionRef.current.value = selectedItem.description;
                }
            }, 0);
        }
    }, [selectedItem])

    return (
        <CustomDialog open={openDialog} close={setOpenDialog} title="新增物品">
            <section>
                <aside>
                    <span className="text-sm pl-1">物品名稱</span>
                    <Input className="w-[100%] pt-1 pb-1 pl-3 border border-solid border-slate-500 outline-none w-11/12 rounded" placeholder="請輸入物品名稱" ref={nameRef}/>
                </aside>
                <aside className="mt-3">
                    <span className="text-sm pl-1">物品敘述</span>
                    <Input className="w-[100%] pt-1 pb-1 pl-3 border border-solid border-slate-500 outline-none w-11/12 rounded" placeholder="請輸入物品敘述" ref={descriptionRef}/>
                </aside>
                <aside className="mt-3">
                    <span className="text-sm pl-1">選擇圖片</span>
                    <Inputfile 
                        accept=".jpg, .jpeg" 
                        onChange={(e) => {
                            let file = null;
                            if(e) file = e.target.files![0];
                            setImage(file!);
                        }}
                        defaultImage={selectedItem && selectedItem.image ? ImagePath + selectedItem.image : undefined}
                    />
                </aside>
                <aside className="mt-3">
                    <span className="text-sm pl-1">選擇種類</span>
                    <Listbox value={selected} onChange={setSelected}>
                        <ListboxButton className="w-[100%] pt-1 pb-1 pl-3 border border-solid border-slate-500 outline-none w-11/12 rounded text-left">{selected}</ListboxButton>
                        <ListboxOptions anchor="bottom" className="z-20 w-[var(--button-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none">
                        {
                            ItemTypes.map(item => {
                                return (
                                    <ListboxOption key={item} value={item} className="  group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10">
                                        {item}
                                    </ListboxOption>
                                )
                            })
                        }
                        </ListboxOptions>
                    </Listbox>
                </aside>
            </section>
            <Button 
                className="mt-3 text-topcovercolor rounded-md py-2.5 px-5 bg-coverground m-auto block"
                onClick={async () => {
                    const name = nameRef.current?.value || "";
                    const description = descriptionRef.current?.value || "";
                    console.log(image)

                    const result = await setItem(name || "", selected, description, image, selectedItem?.id ,selectedItem?.image);
                    console.log(result)
                }}
            >送出</Button>
        </CustomDialog>
    )
}