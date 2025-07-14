'use client';

import React, { useState, useEffect, memo } from 'react';
import { Input } from "@headlessui/react";

export enum E_RegexType {
    PHONE = 'PHONE',
    NAME = 'NAME',
    ADDRESS = 'ADDRESS',
    EMAIL = 'EMAIL',
    NUMBER = 'NUMBER',
}

interface I_props {
    title: string;
    placeholder: string;
    type: E_RegexType;
    value?: string;
    unnecessary?: boolean;
    maxlength: number;
    className?: string;
    onChange: (value: string) => void;
}

function InputBar ({title, placeholder, type, value, unnecessary, maxlength, className, onChange}: I_props) {
    const [errMsg, setErrMsg] = useState<string | undefined>();

    useEffect(() => {
        let flag = true;
        const RegexNumTypes = /^[0-9]*$/;
        // const RegexChineseTypes = /^[^\u4e00-\u9fa5]+$/;
        const RegexPhoneNum = /^09\d{8}$/;
        const RegexDecimalPoint = /^\d+$/;
        const Regexmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        switch(type) {
            // 手機驗證，不為空、為數字、為手機格式
            case E_RegexType.PHONE:
                if(!RegexPhoneNum.test(value!)) {
                    flag = false;
                    setErrMsg('此欄位須為手機格式');
                }
                if(!RegexNumTypes.test(value!)) {
                    flag = false;
                    setErrMsg('此欄位須為數字');
                }
                if(!unnecessary && value === '') {
                    flag = false;
                    setErrMsg(`${title}必填`);
                }
                break;
            case E_RegexType.NAME:
            case E_RegexType.ADDRESS:
                if(!unnecessary && value === '') {
                    flag = false;
                    setErrMsg(`${title}必填`);
                }
                break;
            case E_RegexType.EMAIL:
                if(!Regexmail.test(value!)) {
                    flag = false;
                    setErrMsg('此欄位須為信箱格式');
                }
                if(!unnecessary && value === '') {
                    flag = false;
                    setErrMsg(`${title}必填`);
                }
                break;
            case E_RegexType.NUMBER:
                if(!RegexDecimalPoint.test(value!)) {
                    flag = false;
                    setErrMsg('此欄位只允許數字');
                }
                if(!unnecessary && value === '') {
                    flag = false;
                    setErrMsg(`${title}必填`);
                }
                break;
            default:
                if(!unnecessary && value === '') {
                    flag = false;
                    setErrMsg(`${title}必填`);
                }
        }
        if(flag) setErrMsg(undefined);
    },[value, type, unnecessary, title])

    const titleClassName = title ? "text-sm pl-1 text-coverground" : "";

    return (
        <div className={className}>
            <span className={titleClassName}>{title}</span>
            <Input className='w-[100%] pt-1 pb-1 pl-2 border border-solid border-slate-500 outline-none w-11/12 rounded text-sm' placeholder={placeholder} onChange={e=>onChange(e.target.value)} maxLength={maxlength} value={value}/>
            {errMsg && <span className='text-red-500 mb-0 text-xs ml-1 errormessage'>{errMsg}</span>}
        </div>
    );
}

export default memo(InputBar);