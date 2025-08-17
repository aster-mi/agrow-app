jest.mock('../offlineQueue', () => ({
  enqueue: jest.fn(),
}));

const baseUrl = 'https://example.com';
process.env.EXPO_PUBLIC_API_BASE_URL = baseUrl;

const { addStock } = require('../api');
const { enqueue } = require('../offlineQueue');

describe('addStock', () => {
  beforeEach(() => {
    (enqueue as jest.Mock).mockClear();
  });

  it('posts new stock with details and returns result on success', async () => {
    const mockResp = { id: 1, name: 'test', parent_id: null };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResp),
    }) as any;

    const result = await addStock({
      name: 'test',
      tags: ['tag1'],
      images: ['uri1'],
    });

    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/stocks`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          parent_id: null,
          is_public: true,
          tags: ['tag1'],
          images: ['uri1'],
        }),
      })
    );
    expect(result).toEqual(mockResp);
    expect(enqueue).not.toHaveBeenCalled();
  });

  it('enqueues request with details when network fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network'));
    await addStock({ name: 'offline', tags: ['t'], images: ['i'] });
    expect(enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          body: JSON.stringify({
            name: 'offline',
            parent_id: null,
            is_public: true,
            tags: ['t'],
            images: ['i'],
          }),
        }),
      })
    );
  });
});
