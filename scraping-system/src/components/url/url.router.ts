import { Router } from 'express';
import {
  deleteAllUrls,
  deleteUrl,
  getAllUrls,
  getUrl,
  parseUrl,
  updateUrl,
} from './url.controller';

const router = Router();

router.route('/').get(getAllUrls).post(parseUrl).delete(deleteAllUrls);

router.route('/:id').get(getUrl).patch(updateUrl).delete(deleteUrl);

const urlRouter = router;

export default urlRouter;
