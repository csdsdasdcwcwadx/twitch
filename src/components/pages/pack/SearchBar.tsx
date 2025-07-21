import CustomButton from "@/components/common/CustomButton";
import InputBox, { E_RegexType } from "@/components/common/InputBox";
import { memo } from "react";

interface I_SearchBarProps {
    setQuery: (value: string) => void;
    setOpenDialog?: (flag: boolean) => void;
}

const SearchBar = ({ setQuery, setOpenDialog }: I_SearchBarProps) => {
    return (
        <div className="mb-4 flex mobile:flex-col">
            <InputBox
                title=""
                type={E_RegexType.NAME}
                placeholder="搜尋物品"
                className="w-[100%] h-[100%]"
                maxlength={10}
                onChange={value => setQuery(value)}
            />
            {
                setOpenDialog && <CustomButton 
                    className="pc:w-[10%] w-7 mobile:m-auto mobile:mt-3 mobile:h-[50px] mobile:w-[110px] ml-3 px-0 py-0"
                    onClick={() => setOpenDialog(true)}
                    text="新增物品"
                />
            }
        </div>
    );
};

export default memo(SearchBar);