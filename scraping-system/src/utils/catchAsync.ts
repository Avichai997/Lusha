import { Request, Response, NextFunction } from 'express';

export default (
    fn: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: Request<any>,
      res: Response,
      next: NextFunction,
    ) => Promise<unknown>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line promise/no-callback-in-promise
    fn(req, res, next).catch(next);
  };
