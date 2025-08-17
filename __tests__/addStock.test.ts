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

  it('posts new stock and returns result on success', async () => {
    const mockResp = { id: 1, name: 'test', parent_id: null };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResp),
    }) as any;

    const result = await addStock({ name: 'test' });

    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/api/stocks`,
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toEqual(mockResp);
    expect(enqueue).not.toHaveBeenCalled();
  });

  it('enqueues request when network fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network')); 
    await addStock({ name: 'offline' });
    expect(enqueue).toHaveBeenCalled();
  });
});
