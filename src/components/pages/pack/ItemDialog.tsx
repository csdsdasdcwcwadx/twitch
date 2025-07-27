import { memo, useState, useEffect } from "react";

import { pagesize, ImagePath, ItemTypes } from "@/utils/util";
import { E_Item_Types } from "@/utils/interface";
import { getbackpacks, setItem, deleteItem } from "@/utils/api";
import { I_Item } from "@/utils/interface";

import CustomDialog from "@/components/common/CustomDialog";
import DropSelection from "@/components/common/DropSelection";
import Inputfile from "@/components/common/Inputfile";
import InputBox, { E_RegexType } from "@/components/common/InputBox";
import CustomButton from "@/components/common/CustomButton";

interface I_props {
    openDialog: boolean;
    setOpenDialog: (flag: boolean) => void;
    selectedItem: I_Item | null;
    setItems: (data: I_Item[]) => void;
    page: number;
}

function ItemDialog ({ openDialog, setOpenDialog, selectedItem, setItems, page }: I_props) {
    const [selected, setSelected] = useState(E_Item_Types.CONSUMABLES);
    const [image, setImage] = useState<File>();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (selectedItem) {
            setSelected(selectedItem.type);
            setName(selectedItem.name);
            setDescription(selectedItem.description);
            setAmount(`${selectedItem.amount}`);
        } else {
            setSelected(E_Item_Types.CONSUMABLES);
            setName("");
            setDescription("");
            setAmount("");
        }
    }, [selectedItem])

    return (
        <CustomDialog open={openDialog} close={setOpenDialog} title="新增物品">
            <section>
                <InputBox
                    title="物品名稱"
                    placeholder="請輸入物品名稱"
                    type={E_RegexType.NAME}
                    maxlength={20}
                    value={name}
                    onChange={setName}
                />
                <InputBox
                    title="物品敘述"
                    placeholder="請輸入物品敘述"
                    type={E_RegexType.NAME}
                    maxlength={100}
                    className="mt-2"
                    value={description}
                    onChange={setDescription}
                />
                <InputBox
                    title="物品兌換數量"
                    placeholder="請輸入物品兌換數量"
                    type={E_RegexType.NUMBER}
                    maxlength={2}
                    className="mt-2"
                    value={amount}
                    onChange={setAmount}
                />
                <aside className="mt-2">
                    <span className="text-sm pl-1 text-[#111827]">選擇圖片</span>
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
                <CustomButton
                    onClick={async () => {
                        const result = await setItem(name, selected, description, amount, image, selectedItem?.id ,selectedItem?.image);
                        if (result.status) {
                            const result = await getbackpacks(page, pagesize);
                            if (result.payload) setItems(result.payload.getItems);
                            setOpenDialog(false);
                        } else alert(result.message);
                    }}
                    text={selectedItem ? "更新" : "新增"}
                />
                {
                    selectedItem ? <CustomButton 
                        className="ml-5"
                        onClick={async () => {
                            const result = await deleteItem(selectedItem.image, selectedItem.id);
                            if (result.status) {
                                const result = await getbackpacks(page, pagesize);
                                if (result.payload) setItems(result.payload.getItems);
                                setOpenDialog(false);
                            }
                        }}
                        text="刪除"
                    /> : ""
                }
            </div>
        </CustomDialog>
    )
}

export default memo(ItemDialog);