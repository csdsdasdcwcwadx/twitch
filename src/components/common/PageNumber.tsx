import React, { memo, useRef } from "react";

interface I_props {
    maxpage: number;
    serial: number;
    setSerial: (num: number) => void;
    typeIn?: boolean;
}

function PageNumber ({setSerial, maxpage, serial, typeIn}: I_props) {
    const page = useRef<HTMLInputElement>(null);

    return (
        <div className='flex justify-center items-center'>
            <div className="flex justify-center items-center text-xl">
                <Nums num={serial-2} click={setSerial} maxpage={maxpage} serial={serial}/>
                <Nums num={serial-1} click={setSerial} maxpage={maxpage} serial={serial}/>
                <Nums num={serial} click={setSerial} maxpage={maxpage} serial={serial}/>
                <Nums num={serial+1} click={setSerial} maxpage={maxpage} serial={serial}/>
                <Nums num={serial+2} click={setSerial} maxpage={maxpage} serial={serial}/>
                <div>......</div>
                <Nums num={maxpage} click={setSerial} maxpage={maxpage}/>
            </div>
            {
                typeIn && <div>
                    <input className="block m-auto mt-2 outline-none" type="text" placeholder="請輸入頁碼" ref={page} onKeyUp={e=>{
                        if(e.code !== "Enter") return;
                        if (page.current) {
                            if(isNaN(parseInt(page.current.value!))) return;
                            if(parseInt(page.current.value!) <= 0 || parseInt(page.current.value!) > maxpage) return;
                            setSerial(parseInt(page.current.value!));
                        } else return;
                    }}/>
                </div>
            }
        </div>
    )
}

interface I_NumsProps {
    num: number;
    maxpage: number;
    click: (num: number) => void;
    serial?: number;
}

function Nums ({num, click, maxpage, serial}: I_NumsProps) {
    const className = [
        'flex',
        'justify-center',
        'items-center',
        'w-[30px]',
        'h-[30px]',
        'cursor-pointer',
        'mr-1',
        'ml-1',
        'hover:bg-coverground',
        'hover:text-topcovercolor',
        'rounded-3xl',
    ];
    if (num <= 0 || num > maxpage) {
        className.push('hidden');
    }
    if (serial && serial === num) {
        className.push('text-center');
        className.push('text-topcovercolor');
        className.push('bg-coverground')
    }

    return (
        <span 
            onClick={()=>click(num)} 
            className={className.join(' ')}
        >
            {num}
        </span>
    )
}

export default memo(PageNumber);