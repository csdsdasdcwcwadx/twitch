'use client';

import { useState, useMemo, useEffect } from "react";
import { Input } from "@headlessui/react";
import { ItemTypes, ImagePath } from "@/utils/util";
import { I_Item, E_Item_Types } from "@/utils/interface";
import Image from "next/image";
import { getpacks } from "@/utils/api";

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
}

interface I_ItemGridProps {
    items: I_Item[];
}

export default function Pack() {
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
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
                        <ItemGrid items={filterItemCheck}/>
                    </div>
                </div>
            </div>
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

const ItemGrid = ({ items }: I_ItemGridProps) => {
    return (
        <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
            {items.map((item) => {
                if (!item.userItems?.length) return;
                return (
                    <div
                        key={item.id}
                        className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 min-h-[200px] aspect-1"
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
                )
            })}
        </div>
    );
};