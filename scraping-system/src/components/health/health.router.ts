import { Request, Router, Response } from 'express';
import { version } from '../../../package.json';
import { EmptyObject, HealthStatusResponse, HealthStatusStatusEnum } from '../../types';

export const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check the health status of the server
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 version:
 *                   type: string
 *                   example: "Server is healthy and running version: 1.0.0"
 */
router.get('/', (req: Request<EmptyObject, HealthStatusResponse, EmptyObject>, res: Response) => {
  res.send({
    status: HealthStatusStatusEnum.Ok,
    version: `Server is healthy and running version: ${version}`,
  });
});

const healthRouter = router;

export default healthRouter;
