import { Request, Router } from 'express';
import { version } from '../../../package.json';
import { EmptyObject, HealthStatus } from '../../interfaces/common';

export const router = Router();

router.get('/', (req: Request<EmptyObject, HealthStatus, EmptyObject>, res) => {
  res.send({
    status: 'OK',
    version: `Server is healthy and running version: ${version}`,
  });
});

const healthRouter = router;

export default healthRouter;
