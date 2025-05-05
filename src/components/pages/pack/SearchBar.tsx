import InputBox, { E_RegexType } from "@/components/common/InputBox";
import { Button } from "@headlessui/react";
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
                setOpenDialog && <Button 
                    className="pc:w-[10%] bg-coverground text-topcovercolor rounded-md w-7 mobile:m-auto mobile:mt-3 mobile:h-[50px] mobile:w-[110px] ml-3"
                    onClick={() => setOpenDialog(true)}>新增物品</Button>
            }
        </div>
    );
};

export default memo(SearchBar);