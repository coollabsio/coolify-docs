export const SPONSORS_URL =
  'https://raw.githubusercontent.com/coollabsio/coollabs-cdn/main/json/sponsors.json';

export type SponsorTier = 'huge' | 'big';

export type Sponsor = {
  name: string;
  url: string;
  description: string;
  imageKey?: string;
  imagePath?: string;
  imageUrl?: string;
  docsImageKey?: string;
  docsImagePath?: string;
  docsImageUrl?: string;
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
    docsImagesBaseUrl?: string;
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
