'use client';

import { ChangeEvent, memo, useEffect, useState } from "react";
import Image from "next/image";
import uploadSrc from '@/icon/upload.png';
import closeSrc from '@/icon/close.png'

interface I_props {
    onChange: (event: ChangeEvent<HTMLInputElement> | null) => void;
    accept: string;
    defaultImage?: string;
}

function InputFile({onChange, accept, defaultImage}: I_props) {
    const [displayImage, setDisplayImage] = useState<string | ArrayBuffer | null>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event);
        const file = event.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setDisplayImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        if(defaultImage) setDisplayImage(defaultImage);
        else setDisplayImage('');
    }, [defaultImage])

    return (
        <div>
            <label htmlFor="upload" className="relative inline-block bg-gray-100 text-gray-800 border border-gray-300 px-3 py-2 cursor-pointer w-[100%] h-72 rounded-xl">
                { displayImage && <Image src={displayImage as string} alt="image" fill sizes='100%' className="rounded-xl object-cover"/>}
                <div className="absolute top-1/2 left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
                    <Image src={uploadSrc} alt="image" fill sizes='100%'/>
                </div>
                <div className="absolute top-[7px] right-[7px] w-[25px] h-[25px] opacity-70" onClick={event => {
                    event.preventDefault();
                    onChange(null);
                    setDisplayImage('');
                }}>
                    <Image src={closeSrc} alt="image" fill sizes='100%'/>
                </div>
            </label>
            <input 
                type="file" 
                onChange={handleChange}
                accept={accept}
                className="hidden"
                id="upload"
            />
        </div>
    )
}

export default memo(InputFile);