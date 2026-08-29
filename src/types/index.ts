export interface Product {
  name: string;
  badge: string;
  image: string;
  rating: number;
  amazonAsin: string;
  affiliateUrl?: string;
  price: string;
  pros: string[];
  cons: string[];
  description: string;
}

export interface Article {
  title: string;
  slug: string;
  category: string;
  metaDescription: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  intro: string;
  products?: Product[];
  content?: string;
  buyingGuide?: { title: string; content: string };
  faq?: { question: string; answer: string }[];
  ambianceStyle?: string;
  ambianceRoom?: string;
}

export interface AmbianceRoom {
  name: string;
  slug: string;
  articleSlug: string;
}

export interface Ambiance {
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  colorAccent: string;
  icon: string;
  rooms: AmbianceRoom[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
}
