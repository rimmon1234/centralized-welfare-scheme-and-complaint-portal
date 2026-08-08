const API_BASE_URL = 'http://localhost:5000/api';

export interface BackendScheme {
  id: string;
  externalId?: string;
  source?: string;
  sourceUrl?: string;
  title: string;
  category: string;
  tag?: string;
  description: string;
  benefit: string;
  eligibility: string;
  isActive: boolean;
  applicationsCount: number;
}

export interface FetchSchemesResponse {
  schemes: BackendScheme[];
  count: number;
  page: number;
  totalPages: number;
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/schemes/categories`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn('Backend categories API unavailable; using fallback.');
  }
  return [];
}

export async function fetchSchemes(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<FetchSchemesResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    query.append('limit', String(params?.limit || 20));

    const res = await fetch(`${API_BASE_URL}/schemes?${query.toString()}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return {
        schemes: json.data,
        count: json.count || json.data.length,
        page: json.page || 1,
        totalPages: json.totalPages || Math.ceil((json.count || json.data.length) / 20) || 1,
      };
    }
  } catch (err) {
    console.warn('Backend schemes API unavailable; falling back to local dataset.');
  }
  return { schemes: [], count: 0, page: 1, totalPages: 1 };
}
