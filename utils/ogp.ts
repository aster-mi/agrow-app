import { Post } from '../db';

export const generateOGPMeta = (post: Post): string => {
  const image = post.images[0] || '';
  const lines = [
    `<meta property="og:title" content="Agrow Post #${post.id}" />`,
    `<meta property="og:description" content="${post.text}" />`,
  ];
  if (image) {
    lines.push(`<meta property="og:image" content="${image}" />`);
  }
  return lines.join('\n');
};
