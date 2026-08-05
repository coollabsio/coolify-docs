export const SPONSORS_URL =
  'https://cdn.coollabs.io/sponsors.json';

export type SponsorTier = 'huge' | 'big';

export type Sponsor = {
  name: string;
  url: string;
  description: string;
  image?: {
    key?: string;
    path?: string;
    url: string;
    docs?: {
      key?: string;
      path?: string;
      url?: string;
    };
  };
  tier: SponsorTier;
  pinned?: boolean;
  imageStyle?: string;
  hugeImageStyle?: string;
  hugeCardStyle?: string;
  additionalContent?: string;
  offPlatform?: {
    aliases: string[];
    until?: string;
  };
};

export type SponsorsResponse = {
  version: number;
  updatedAt: string;
  sources: {
    repository: string;
    landing: string;
    imagesBaseUrl: string;
  };
  tiers: Record<SponsorTier, Sponsor[]>;
};

export async function fetchSponsors(): Promise<SponsorsResponse> {
  const response = await fetch(SPONSORS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch sponsors: ${response.status}`);
  }

  return response.json() as Promise<SponsorsResponse>;
}
