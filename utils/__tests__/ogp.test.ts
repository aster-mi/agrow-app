import { generateOGPMeta } from '../ogp';
import { Post } from '../../db';

describe('generateOGPMeta', () => {
  test('includes image tag when image exists', () => {
    const post: Post = { id: 1, text: 'Hello', images: ['img.jpg'] };
    const meta = generateOGPMeta(post);
    expect(meta).toContain('<meta property="og:title" content="Agrow Post #1" />');
    expect(meta).toContain('<meta property="og:description" content="Hello" />');
    expect(meta).toContain('<meta property="og:image" content="img.jpg" />');
  });

  test('omits image tag when no image', () => {
    const post: Post = { id: 2, text: 'No image', images: [] };
    const meta = generateOGPMeta(post);
    expect(meta).toContain('<meta property="og:title" content="Agrow Post #2" />');
    expect(meta).toContain('<meta property="og:description" content="No image" />');
    expect(meta).not.toContain('og:image');
  });
});
