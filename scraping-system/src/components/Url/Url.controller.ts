import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import UrlService from './Url.service';
import catchAsync from '../../utils/catchAsync';
import parse from 'lusha-mock-parser';
import AppError from '../../utils/AppError';
import Url from '../Url/Url.model';

export const parseUrl = catchAsync(async (req, res) => {
  const { url } = req.body;

  if (!url) throw new AppError('URL is required', StatusCodes.BAD_REQUEST);

  const result = parse(url);

  const createdUrl = await Url.create({ url, html: result.html, links: result.links });
  res.status(StatusCodes.CREATED).json(createdUrl);
});

export const getAllUrls = catchAsync(async (req, res) => {
  const urls = await UrlService.getAllUrls(req);
  res.status(StatusCodes.OK).json(urls);
});

export const getUrl = catchAsync(async (req: Request<{ id: string }>, res) => {
  const url = await UrlService.getUrl(req);
  res.status(StatusCodes.OK).json(url);
});

export const createUrl = catchAsync(async (req, res) => {
  const url = await UrlService.createUrl(req);
  res.status(StatusCodes.CREATED).json(url);
});

export const updateUrl = catchAsync(async (req: Request<{ id: string }>, res) => {
  const url = await UrlService.updateUrl(req);
  res.status(StatusCodes.OK).json(url);
});

export const deleteUrl = catchAsync(async (req: Request<{ id: string }>, res) => {
  await UrlService.deleteUrl(req);
  res.status(StatusCodes.NO_CONTENT).json(null);
});
