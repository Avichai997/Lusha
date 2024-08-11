import { Request, Router } from 'express';
import { version } from '../../../package.json';
import { EmptyObject, HealthStatusResponse, HealthStatusStatusEnum } from '../../types';

export const router = Router();

router.get('/', (req: Request<EmptyObject, HealthStatusResponse, EmptyObject>, res) => {
  res.send({
    status: HealthStatusStatusEnum.Ok,
    version: `Server is healthy and running version: ${version}`,
  });
});

const healthRouter = router;

export default healthRouter;
