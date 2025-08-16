interface Req {
  ip: string;
}

interface Res {
  status: (code: number) => Res;
  json: (body: unknown) => void;
}

type Next = () => void;

interface HitInfo {
  count: number;
  expires: number;
}

export default function rateLimiter(limit = 60, windowMs = 60_000) {
  const hits = new Map<string, HitInfo>();
  return (req: Req, res: Res, next: Next) => {
    const now = Date.now();
    const ip = req.ip;
    const entry = hits.get(ip) || { count: 0, expires: now + windowMs };
    if (now > entry.expires) {
      entry.count = 0;
      entry.expires = now + windowMs;
    }
    entry.count += 1;
    hits.set(ip, entry);
    if (entry.count > limit) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }
    next();
  };
}
