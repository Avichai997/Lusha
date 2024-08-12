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

/**
 * @swagger
 * /api/parse:
 *   get:
 *     summary: Get all parsed URLs
 *     responses:
 *       200:
 *         description: A list of all URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   html:
 *                     type: string
 *                   links:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.route('/').get(getAllUrls);

/**
 * @swagger
 * /api/parse:
 *   post:
 *     summary: Parse a URL and save the result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://www.example.com"
 *     responses:
 *       201:
 *         description: URL successfully parsed and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 html:
 *                   type: string
 *                 links:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request, URL is required
 */
router.route('/').post(parseUrl);

/**
 * @swagger
 * /api/parse:
 *   delete:
 *     summary: Delete all URLs
 *     responses:
 *       204:
 *         description: All URLs successfully deleted
 */
router.route('/').delete(deleteAllUrls);

/**
 * @swagger
 * /api/parse/{id}:
 *   get:
 *     summary: Get a URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL ID
 *     responses:
 *       200:
 *         description: The requested URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 html:
 *                   type: string
 *                 links:
 *                   type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: URL not found
 */
router.route('/:id').get(getUrl);

/**
 * @swagger
 * /api/parse/{id}:
 *   delete:
 *     summary: Delete a URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL ID
 *     responses:
 *       204:
 *         description: URL successfully deleted
 *       404:
 *         description: URL not found
 */
router.route('/:id').delete(deleteUrl);

const urlRouter = router;

export default urlRouter;
