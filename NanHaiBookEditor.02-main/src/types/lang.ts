import {zh} from '@i18n';
export type LangType = 'zh' | 'en';
type LangKey = keyof typeof zh;

export type Lang = {[key in LangKey]: string};
