import request from 'supertest';
import app from '../app';
import UrlService from '../components/url/url.service';
import Url from '../components/url/url.model';
import parse from 'lusha-mock-parser';
import AppError from '../utils/AppError';
import mongoose from 'mongoose';

jest.mock('../components/url/url.service');
jest.mock('lusha-mock-parser');

describe('Url Controller', () => {
  describe('getAllUrls', () => {
    it('should return all URLs', async () => {
      const urls = [
        { url: 'https://example.com', html: '<html></html>', links: [] },
        { url: 'https://example.org', html: '<html></html>', links: [] },
      ];

      (UrlService.getAllUrls as jest.Mock).mockResolvedValue(urls);

      const res = await request(app).get('/api/parse');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(urls);
      expect(UrlService.getAllUrls).toHaveBeenCalled();
    });
  });

  describe('getUrl', () => {
    it('Should return a single URL by ID', async () => {
      const url = { url: 'https://example.com', html: '<html></html>', links: [] };

      (UrlService.getUrl as jest.Mock).mockResolvedValue(url);

      const res = await request(app).get('/api/parse/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(url);
      expect(UrlService.getUrl).toHaveBeenCalledWith(expect.any(Object));
    });

    it('Should return a 404 if URL is not found', async () => {
      (UrlService.getUrl as jest.Mock).mockImplementation(() => {
        throw new AppError('Record not found', 404);
      });

      const res = await request(app).get('/api/parse/123');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body).toHaveProperty('message', 'Record not found');
    });
  });
});
