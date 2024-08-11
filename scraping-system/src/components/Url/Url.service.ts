import { Request } from 'express';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../servicesFactory';
import Url from './Url.model';
import { EmptyObject, UrlType } from '../../types';

namespace UrlService {
  export const getAllUrls = (
    req: Request<Record<string, string>, UrlType[], EmptyObject>
  ) => {
    const urls = getAll(Url, req);

    return urls;
  };

  export const getUrl = (req: Request<{ id: string }, UrlType>) => {
    const url = getOne(Url, req);

    return url;
  };

  export const createUrl = (req: Request<EmptyObject, UrlType, UrlType>) => {
    const url = createOne(Url, req);

    return url;
  };

  export const updateUrl = (req: Request<{ id: string }>) => {
    const url = updateOne(Url, req);

    return url;
  };

  export const deleteUrl = (req: Request<{ id: string }, null, null>) => {
    const url = deleteOne(Url, req);

    return url;
  };
}

export default UrlService;
