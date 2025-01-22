'use client';

import { useState, useMemo } from "react";
import { ItemTypes } from "@/utils/util";
import { Input } from "@headlessui/react";
import { E_Item_Types } from "@/utils/util";

const items = [
    { id: 1, name: "Sword", description: "A sharp blade.", image: "/sword.png", type: E_Item_Types.WEAPONS },
    { id: 2, name: "Shield", description: "A sturdy shield.", image: "/shield.png", type: E_Item_Types.TOOLS },
    { id: 3, name: "Potion", description: "Restores health.", image: "/potion.png", type: E_Item_Types.CONSUMABLES },
    { id: 4, name: "Bow", description: "A ranged weapon.", image: "/bow.png", type: E_Item_Types.WEAPONS },
    { id: 5, name: "Hammer", description: "A tool for construction.", image: "/hammer.png", type: E_Item_Types.TOOLS },
    { id: 6, name: "Bandage", description: "Heals minor wounds.", image: "/bandage.png", type: E_Item_Types.CONSUMABLES },
    { id: 7, name: "Dagger", description: "A small, sharp knife.", image: "/dagger.png", type: E_Item_Types.WEAPONS },
    { id: 8, name: "Axe", description: "Chops wood effectively.", image: "/axe.png", type: E_Item_Types.TOOLS },
    { id: 9, name: "Magic Scroll", description: "Contains a powerful spell.", image: "/scroll.png", type: E_Item_Types.CONSUMABLES },
    { id: 10, name: "Crossbow", description: "A precise ranged weapon.", image: "/crossbow.png", type: E_Item_Types.WEAPONS },
    { id: 11, name: "Wrench", description: "Used for mechanical repairs.", image: "/wrench.png", type: E_Item_Types.TOOLS },
    { id: 12, name: "Herbs", description: "Used in healing potions.", image: "/herbs.png", type: E_Item_Types.CONSUMABLES },
    { id: 13, name: "Lance", description: "A long, sharp weapon.", image: "/lance.png", type: E_Item_Types.WEAPONS },
    { id: 14, name: "Saw", description: "Used for cutting wood.", image: "/saw.png", type: E_Item_Types.TOOLS },
    { id: 15, name: "Elixir", description: "Grants temporary strength.", image: "/elixir.png", type: E_Item_Types.CONSUMABLES },
];

export default function Pack() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);

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
    }, [items, query, currentType]);
  
    return (
        <div className="flex h-screen">
            <Sidebar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} onSelectItem={setSelectedItem} />
                    </div>
                    <div className="w-1/3">
                        <PreviewPane selectedItem={selectedItem} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const Sidebar = ({ setCurrentType }: any) => {
    return (
        <div className="w-1/4 bg-coverground p-4">
            <h2 className="text-xl text-topcovercolor font-bold mb-4">Categories</h2>
            <ul>
                {ItemTypes.map((category) => (
                    <li key={category} className="mb-2 text-topcovercolor cursor-pointer hover:bg-hoverground p-3" onClick={() => setCurrentType(category)}>
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SearchBar = ({ setQuery }: any) => {
    return (
        <div className="mb-4">
        <Input
            type="text"
            placeholder="搜尋物品"
            className="w-full p-2 rounded shadow border border-solid border-slate-500 outline-none"
            onChange={(event) => setQuery(event.target.value)}
        />
        </div>
    );
};

const ItemGrid = ({ items, onSelectItem }: any) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {items.map((item: any) => (
                <div
                    key={item.id}
                    className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50"
                    onClick={() => onSelectItem(item)}
                >
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2" />
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-foreground">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

const PreviewPane = ({ selectedItem }: any) => {
    if (!selectedItem) {
        return <div className="p-4">Select an item to see details</div>;
    }
  
    return (
        <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-40 object-cover my-4" />
            <p>{selectedItem.description}</p>
            <ul className="mt-4">
            {/* {selectedItem.attributes.map((attr: any, index: number) => (
                <li key={index} className="text-sm">
                    {attr}
                </li>
            ))} */}
            </ul>
        </div>
    );
};