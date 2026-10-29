export interface PropertyRecord {
  id: number;
  ref: string;
  slug: string;
  title: string;
  category: string;
  transactionType: string;
  description: string;
  location: string;
  region: string;
  price: number | null;
  currency: string;
  landArea: string | null;
  buildingArea: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  features: string[];
  availability: string;
  featured: boolean;
  published: boolean;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  sort: number;
}

export interface ProjectRecord {
  id: number;
  slug: string;
  title: string;
  location: string;
  category: string;
  status: string;
  description: string;
  features: string[];
  coverImage: string | null;
  published: boolean;
  sort: number;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface EnquiryRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  source: string;
  propertyId: number | null;
  propertyRef: string | null;
  country: string | null;
  preferredContact: string;
  message: string;
  consent: boolean;
  status: string;
  createdAt: string;
}

export interface ArticleRecord {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface TeamMemberRecord {
  id: number;
  slug: string;
  name: string;
  role: string;
  summary: string;
  bio: Record<string, unknown>;
  portrait: string | null;
  published: boolean;
  sort: number;
}
