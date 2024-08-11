import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import UrlService from '../components/Url/Url.service';
import Url from '../components/Url/Url.model';
import parse from 'lusha-mock-parser'; // Adjusted import for lusha-mock-parser
import AppError from '../utils/AppError';

jest.mock('../components/Url/Url.service');
jest.mock('lusha-mock-parser');
jest.mock('../components/Url/Url.model');

describe('Url Controller', () => {
  // describe('parseUrl', () => {
  //   it('should parse and save a new URL', async () => {
  //     const parsedResult = {
  //       html: '<html></html>',
  //       links: ['https://example.com/subpage'],
  //     };

  //     (parse as jest.Mock).mockReturnValue(parsedResult);
  //     (Url.create as jest.Mock).mockResolvedValue(parsedResult);
  //     (Url.findOne as jest.Mock).mockResolvedValue(null);

  //     const res = await request(app).post('/api/parse').send({ url: 'https://example.com' });

  //     expect(res.status).toBe(201);
  //     expect(res.body).toHaveProperty('html', parsedResult.html);
  //     expect(res.body).toHaveProperty('links', parsedResult.links);
  //     expect(parse).toHaveBeenCalledWith('https://example.com');
  //     expect(Url.create).toHaveBeenCalledWith({
  //       url: 'https://example.com',
  //       html: parsedResult.html,
  //       links: parsedResult.links,
  //     });
  //   });

  //   it('should return an error if URL is missing', async () => {
  //     const res = await request(app).post('/api/parse').send({});

  //     expect(res.status).toBe(400);
  //     expect(res.body).toHaveProperty('status', 'fail');
  //     expect(res.body).toHaveProperty('message', 'URL is required');
  //   });

  //   it('should return a message if URL already exists', async () => {
  //     const existingUrl = {
  //       url: 'https://example.com',
  //       html: '<html></html>',
  //       links: [],
  //     };

  //     (Url.findOne as jest.Mock).mockResolvedValue(existingUrl);

  //     const res = await request(app).post('/api/parse').send({ url: 'https://example.com' });

  //     expect(res.status).toBe(200);
  //     expect(res.body).toEqual(existingUrl);
  //     expect(Url.findOne).toHaveBeenCalledWith({ url: 'https://example.com' });
  //   });
  // });

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
    it('should return a single URL by ID', async () => {
      const url = { url: 'https://example.com', html: '<html></html>', links: [] };

      (UrlService.getUrl as jest.Mock).mockResolvedValue(url);

      const res = await request(app).get('/api/parse/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(url);
      expect(UrlService.getUrl).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return a 404 if URL is not found', async () => {
      (UrlService.getUrl as jest.Mock).mockImplementation(() => {
        throw new AppError('Record not found', 404);
      });

      const res = await request(app).get('/api/parse/123');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('status', 'fail');
      expect(res.body).toHaveProperty('message', 'Record not found');
    });
  });

  // describe('createUrl', () => {
  //   it('should create a new URL', async () => {
  //     const urlData = { url: 'https://example10.com', html: '<html></html>', links: [] };

  //     // Mock the parse function to return the expected result
  //     (parse as jest.Mock).mockReturnValue({ html: '<html></html>', links: [] });

  //     // Mock the UrlService.createUrl method to resolve with the provided urlData
  //     (UrlService.createUrl as jest.Mock).mockResolvedValue(urlData);

  //     // Make the request to create the URL
  //     const res = await request(app).post('/api/parse').send({ url: 'https://example10.com' });

  //     // Log the response for debugging
  //     console.warn('Response:', res.body);

  //     // Assertions to verify the response
  //     expect(res.status).toBe(201);
  //     expect(res.body).toEqual(urlData);
  //     expect(UrlService.createUrl).toHaveBeenCalledWith(expect.any(Object));
  //   });

  //   it('should return a 400 error if URL is missing', async () => {
  //     const res = await request(app).post('/api/parse').send({});

  //     expect(res.status).toBe(400);
  //     expect(res.body).toHaveProperty('status', 'fail');
  //     expect(res.body).toHaveProperty('message', 'URL is required');
  //   });

  //   it('should return a 500 error if UrlService.createUrl fails', async () => {
  //     (UrlService.createUrl as jest.Mock).mockImplementation(() => {
  //       throw new AppError('Internal Server Error', 500);
  //     });

  //     const res = await request(app).post('/api/parse').send({ url: 'https://example10.com' });

  //     expect(res.status).toBe(500);
  //     expect(res.body).toHaveProperty('status', 'error');
  //     expect(res.body).toHaveProperty('message', 'Internal Server Error');
  //   });
  // });

  // describe('updateUrl', () => {
  //   it('should update an existing URL', async () => {
  //     const updatedUrl = { url: 'https://example.com', html: '<html></html>', links: [] };

  //     (UrlService.updateUrl as jest.Mock).mockResolvedValue(updatedUrl);

  //     const res = await request(app).patch('/api/parse/123').send(updatedUrl);

  //     expect(res.status).toBe(200);
  //     expect(res.body).toEqual(updatedUrl);
  //     expect(UrlService.updateUrl).toHaveBeenCalledWith(expect.any(Object));
  //   });

  //   it('should return a 404 if URL is not found for update', async () => {
  //     (UrlService.updateUrl as jest.Mock).mockResolvedValue(null);

  //     const res = await request(app).patch('/api/parse/123').send({});

  //     expect(res.status).toBe(404);
  //     expect(res.body).toHaveProperty('status', 'fail');
  //     expect(res.body).toHaveProperty('message', 'Record not found');
  //   });
  // });

  // describe('deleteUrl', () => {
  //   it('should delete an existing URL', async () => {
  //     (UrlService.deleteUrl as jest.Mock).mockResolvedValue(null);

  //     const res = await request(app).delete('/api/parse/123');

  //     expect(res.status).toBe(204);
  //     expect(res.body).toEqual({});
  //     expect(UrlService.deleteUrl).toHaveBeenCalledWith(expect.any(Object));
  //   });

  //   it('should return a 404 if URL is not found for deletion', async () => {
  //     (UrlService.deleteUrl as jest.Mock).mockResolvedValue(null);

  //     const res = await request(app).delete('/api/parse/123');

  //     expect(res.status).toBe(404);
  //     expect(res.body).toHaveProperty('status', 'fail');
  //     expect(res.body).toHaveProperty('message', 'Record not found');
  //   });
  // });
});
