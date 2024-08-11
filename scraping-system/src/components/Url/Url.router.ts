import { Router } from 'express';
import { createUrl, deleteUrl, getAllUrls, getUrl, parseUrl, updateUrl } from './Url.controller';

const router = Router();

router.route('/').get(getAllUrls).post(parseUrl);

router.route('/:id').get(getUrl).patch(updateUrl).delete(deleteUrl);

const urlRouter = router;

export default urlRouter;
