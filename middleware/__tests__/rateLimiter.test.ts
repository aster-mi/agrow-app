import rateLimiter from '../rateLimiter';

function createReq(ip: string = '1.2.3.4') {
  return { ip };
}

function createRes() {
  return {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
    },
  };
}

describe('rateLimiter', () => {
  test('allows requests under the limit', () => {
    const middleware = rateLimiter(2, 1000);
    const res = createRes();
    const next = jest.fn();

    middleware(createReq(), res, next);
    middleware(createReq(), res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.statusCode).toBe(200);
  });

  test('blocks requests over the limit', () => {
    const middleware = rateLimiter(1, 1000);
    const res = createRes();
    const next = jest.fn();

    middleware(createReq(), res, next);
    middleware(createReq(), res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ error: 'Too many requests' });
  });

  test('resets counts after window', () => {
    jest.useFakeTimers();
    const middleware = rateLimiter(1, 1000);
    const res = createRes();
    const next = jest.fn();

    middleware(createReq(), res, next);
    jest.advanceTimersByTime(1001);
    middleware(createReq(), res, next);

    expect(next).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});
