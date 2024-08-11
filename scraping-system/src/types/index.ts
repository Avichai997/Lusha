import { PopulateOptions } from 'mongoose';

export type UrlType = {
  url: string;
  html: string;
  links: string[];
};

export type IPopulateOptions = PopulateOptions | (PopulateOptions | string)[];

export type EmptyObject = Record<string, never>;
