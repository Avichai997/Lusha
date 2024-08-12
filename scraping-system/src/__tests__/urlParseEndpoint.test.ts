import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Url from '../components/url/url.model';
import parse from 'lusha-mock-parser';

jest.mock('lusha-mock-parser');

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  jest.setTimeout(60000); // 60 seconds timeout
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  await Url.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('/api/parse Endpoint', () => {
  it('should parse the URL, save it, and save all related links to the database', async () => {
    const mockParseResult = {
      html: '<html lang="en-us"> ... </html>',
      links: [
        'www.a.site.com',
        'www.b.site.com',
        'www.c.site.com',
        'www.d.site.com',
        'www.e.site.com',
        'www.f.site.com',
      ],
    };
    (parse as jest.Mock).mockReturnValue(mockParseResult);

    const url = 'http://www.mysite.com/';
    await request(app).post('/api/parse').send({ url }).expect(201);

    const savedUrl = await Url.findOne({ url });
    expect(savedUrl).not.toBeNull();
    expect(savedUrl).toHaveProperty('html', mockParseResult.html);
    expect(savedUrl).toHaveProperty('links', mockParseResult.links);

    for (const link of mockParseResult.links) {
      const linkUrl = await Url.findOne({ url: link });
      expect(linkUrl).not.toBeNull();
      expect(linkUrl).toHaveProperty('url', link);
      expect(linkUrl).toHaveProperty('html');
    }
  }, 30000); // Increase timeout to 30 seconds for this test

  it('should return 400 if URL is not provided', async () => {
    const response = await request(app).post('/api/parse').send({}).expect(400);

    expect(response.body).toHaveProperty('status', 'fail');
    expect(response.body).toHaveProperty('message', 'URL is required');
  }, 30000); // Increase timeout to 30 seconds for this test

  it('should not save the URL if it already exists', async () => {
    const url = 'https://example.com';
    const existingUrl = new Url({
      url,
      html: '<html lang="en-us"> ... </html>',
      links: [],
    });
    await existingUrl.save();

    const response = await request(app).post('/api/parse').send({ url }).expect(201);

    expect(response.body).toHaveProperty('url', url);
    expect(response.body).toHaveProperty('html', existingUrl.html);
    expect(response.body).toHaveProperty('links', existingUrl.links);

    const urls = await Url.find({ url });
    expect(urls).toHaveLength(1);
  }, 30000); // Increase timeout to 30 seconds for this test
});
