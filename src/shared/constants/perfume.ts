export const volumes = [1, 2, 3, 5, 10, 20, 30] as const;

export type Volume = (typeof volumes)[number];
