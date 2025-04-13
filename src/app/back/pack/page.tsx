'use client';

import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { Input, Button } from "@headlessui/react";
import { ItemTypes, ImagePath, twitchIconDomain } from "@/utils/util";
import { I_Item, E_Item_Types, I_BackPackPage, I_User } from "@/utils/interface";
import Image from "next/image";
import CustomDialog from "@/components/common/CustomDialog";
import Inputfile from "@/components/common/Inputfile";
import { getbackpacks, setItem, deleteItem, addUserItem } from "@/utils/api";
import searchIcon from "@/icon/search.png";
import arrowdownIcon from "@/icon/arrow-down.png";
import arrowupIcon from "@/icon/arrow-up.png";
import plusIcon from "@/icon/plus.png";
import minusIcon from "@/icon/minus.png";
import InputBox, { E_RegexType } from "@/components/common/InputBox";
import PageNumber from "@/components/common/PageNumber";
import DropSelection from "@/components/common/DropSelection";
import ImageHandler from "@/components/common/ImageHandler";

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
    setOpenItemSettingDialog: (flag: I_Item | null) => void;
}

interface I_ItemDialog {
    openDialog: boolean;
    setOpenDialog: (flag: boolean) => void;
    selectedItem: I_Item | null;
    setData: (data: I_BackPackPage) => void;
    page: number;
}

interface I_ItemSettingDialog {
    selectedItem: I_Item | null;
    setSelectedItem: (flag: I_Item | null) => void;
    data: I_BackPackPage;
    setData: (data: I_BackPackPage) => void;
    page: number;
}

const pagesize = 12;

export default function Pack() {
    const [selectedItem, setSelectedItem] = useState<I_Item | null>(null);
    const [query, setQuery] = useState('');
    const [currentType, setCurrentType] = useState(E_Item_Types.All);
    const [openDialog, setOpenDialog] = useState(false);
    const [openItemSettingDialog, setOpenItemSettingDialog] = useState<I_Item | null>(null);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<I_BackPackPage>({
        getItems: [],
        getAllUsers: [],
        getItemPages: 1,
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
            <Sidebar setCurrentType={setCurrentType}/>
            <div className="flex-1 p-6">
                <SearchBar setQuery={setQuery} setOpenDialog={setOpenDialog}/>
                <div className="flex gap-6">
                    <div className="flex-1">
                        <ItemGrid items={filterItemCheck} onSelectItem={setSelectedItem} setOpenItemSettingDialog={setOpenItemSettingDialog}/>
                    </div>
                </div>
                <div className="mt-8">
                    <PageNumber maxpage={data.getItemPages} serial={page} setSerial={setPage}/>
                </div>
            </div>
            <ItemDialog setOpenDialog={setOpenDialog} openDialog={openDialog} selectedItem={selectedItem} setData={setData} page={page}/>
            <ItemSettingDialog selectedItem={openItemSettingDialog} setSelectedItem={setOpenItemSettingDialog} data={data} setData={setData} page={page}/>
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

const ItemGrid = ({ items, onSelectItem, setOpenItemSettingDialog }: I_ItemGridProps) => {
    return (
        <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="p-4 border rounded shadow cursor-pointer hover:bg-blue-50 min-h-[200px] aspect-1 relative overflow-hidden"
                    onClick={() => onSelectItem(item)}
                >
                    <figure className="relative h-16 cursor-pointer transform h-[50%] rounded">
                        {
                            item.image ? <ImageHandler item={item}/> : <></>
                        }
                    </figure>
                    <h3 className="text-lg font-semibold mt-3 mobile:text-center mobile:text-3xl">{item.name}</h3>
                    <p className="text-sm text-foreground text-lg mobile:text-center pc:h-[24%] overflow-hidden">{item.description}</p>
                    <Button 
                        className="bg-coverground text-topcovercolor w-[100%] mt-auto absolute w-[calc(100%-2em)] bottom-[1em] rounded"
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpenItemSettingDialog(item);
                        }}
                    >
                    設定道具</Button>
                </div>
            ))}
        </div>
    );
};

const ItemDialog = ({ openDialog, setOpenDialog, selectedItem, setData, page}: I_ItemDialog) => {
    const [selected, setSelected] = useState(E_Item_Types.CONSUMABLES);
    const [image, setImage] = useState<File>();

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);

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
                if (amountRef.current) {
                    amountRef.current.value = selectedItem.amount + "";
                }
            }, 0);
        } else {
            setSelected(E_Item_Types.CONSUMABLES);
        }
    }, [selectedItem])

    return (
        <CustomDialog open={openDialog} close={setOpenDialog} title="新增物品">
            <section>
                <InputBox
                    title="物品名稱"
                    placeholder="請輸入物品名稱"
                    type={E_RegexType.NAME}
                    ref={nameRef}
                    maxlength={20}
                />
                <InputBox
                    title="物品敘述"
                    placeholder="請輸入物品敘述"
                    type={E_RegexType.NAME}
                    ref={descriptionRef}
                    maxlength={100}
                    className="mt-2"
                />
                <InputBox
                    title="物品兌換數量"
                    placeholder="請輸入物品兌換數量"
                    type={E_RegexType.NUMBER}
                    ref={amountRef}
                    maxlength={2}
                    className="mt-2"
                />
                <aside className="mt-2">
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
                <DropSelection
                    selections={ItemTypes}
                    setSelected={setSelected}
                    selected={selected}
                    disableOptions={[E_Item_Types.All]}
                    className="mt-2"
                />
            </section>
            <div className="flex justify-center mt-3">
                <Button 
                    className="text-topcovercolor rounded-md py-2.5 px-5 bg-coverground block"
                    onClick={async () => {
                        const name = nameRef.current?.value || "";
                        const description = descriptionRef.current?.value || "";
                        const amount = amountRef.current?.value || "";

                        const result = await setItem(name || "", selected, description, amount, image, selectedItem?.id ,selectedItem?.image);
                        if (result.status) {
                            const result = await getbackpacks(page, pagesize);
                            setData(result);
                            setOpenDialog(false);
                        }
                    }}
                >{selectedItem ? "更新" : "新增"}</Button>
                {
                    selectedItem ? <Button 
                        className="text-topcovercolor rounded-md py-2.5 px-5 bg-coverground block ml-5"
                        onClick={async () => {
                            const result = await deleteItem(selectedItem.image, selectedItem.id);
                            if (result.status) {
                                const result = await getbackpacks(page, pagesize);
                                setData(result);
                                setOpenDialog(false);
                            }
                        }}
                    >刪除</Button> : ""
                }
            </div>
        </CustomDialog>
    )
};

const ItemSettingDialog = ({selectedItem, setSelectedItem, data, setData, page}: I_ItemSettingDialog) => {
    const [query, setQuery] = useState('');
    const [openUser, setOpenUser] = useState<I_User | null>(null);
    const [value, setValue] = useState(0);

    const filterUserCheck = useMemo(() => {
        if (query === "") return data.getAllUsers;
        return data.getAllUsers.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    }, [data, query])

    useEffect(() => {
        if (!selectedItem) {
            setValue(0);
            setOpenUser(null);
        }
    }, [selectedItem])

    const increase = () => setValue((prev) => prev + 1);
    const decrease = () => setValue((prev) => Math.max(0, prev - 1)); // 避免負數

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
          setValue(newValue);
        }
    };

    const currentUserItem = useMemo(() => {
        if (!selectedItem?.userItems) return [];
        return selectedItem?.userItems?.filter(useritem => useritem.user.id === openUser?.id);
    }, [openUser, selectedItem])

    useEffect(() => {
        if (currentUserItem.length && currentUserItem[0].amount) {
            setValue(currentUserItem[0].amount);
        }
    }, [currentUserItem])

    return (
        <CustomDialog open={Boolean(selectedItem)} close={() => setSelectedItem(null)} title="道具設定">
            <section className="mt-5">
                <div className="flex relative">
                    <Image src={searchIcon} alt="search" className="h-5 w-5 absolute left-3"/>
                    <Input
                        placeholder="搜尋持有用戶"
                        onChange={(event) => setQuery(event.target.value)}
                        className="mb-2.5 ml-2.5 pl-7 border-b border-solid border-slate-500 outline-none w-11/12 pb-1"
                    />
                </div>
                <div className="max-h-60 overflow-auto">
                {
                    data.getAllUsers.length ? filterUserCheck.map((user) => {
                        const currentUser = user.id === openUser?.id;

                        return (
                            <Fragment key={user.id}>
                                <aside className="py-2.5 px-3.5 hover:bg-slate-100 rounded flex items-center cursor-pointer relative" onClick={() => {
                                    if (currentUser) setOpenUser(null);
                                    else setOpenUser(user);
                                }}>
                                    <figure className="relative w-9 h-9 mr-2">
                                        <Image src={`${twitchIconDomain}${user.profile_image}`} alt={user.name} sizes="100" fill/>
                                    </figure>
                                    <span>{user.name}</span>
                                    <i className="absolute block w-[20px] h-[20px] right-[30px]">
                                        <Image src={currentUser ? arrowupIcon : arrowdownIcon} alt="arrow-down" className="absolute"/>
                                    </i>
                                </aside>
                                {
                                    currentUser ? <div className="px-3.5 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <i className="block w-[30px] h-[30px] cursor-pointer" onClick={decrease}>
                                                    <Image src={minusIcon} alt="arrow-down" className="absolute"/>
                                                </i>
                                                <Input value={value} type="number" className="text-lg outline-none px-2 border-slate-500 w-[50px] text-center" onChange={handleChange}/>
                                                <i className="block w-[30px] h-[30px] cursor-pointer"  onClick={increase}>
                                                    <Image src={plusIcon} alt="arrow-down" className="absolute"/>
                                                </i>
                                            </div>
                                            <Button onClick={async () => {
                                                const result = await addUserItem(user.id, selectedItem?.id || "", value);
                                                if (result.status) {
                                                    const result = await getbackpacks(page, pagesize);
                                                    setData(result);
                                                    setSelectedItem(null);
                                                }
                                            }} className="m-auto block bg-coverground text-topcovercolor rounded p-[10px] mt-3">送出</Button>
                                        </div>
                                        <div className="mr-5">{`數量 : ${currentUserItem.length && currentUserItem[0].amount}`}</div>
                                    </div> : <></>
                                }
                            </Fragment>
                        )
                    }) : <span className="block text-center mt-2">沒有持有用戶</span>
                }
                </div>
            </section>
        </CustomDialog>
    )
}