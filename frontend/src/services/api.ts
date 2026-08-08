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

export interface FamilyMemberData {
  id?: string;
  userId?: string;
  fullName: string;
  relation: string; // Father, Mother, Spouse, Son, Daughter, Brother, Sister, Dependent Senior, Other
  dob?: string; // Date of Birth (YYYY-MM-DD)
  age: number;
  gender: string; // Male, Female, Other
  occupation: string; // Farmer, Daily Wage Worker, Salaried, Student, Unemployed, Retired, Small Business, Homemaker
  annualIncome: number;
  isStudent: boolean;
  isDisability: boolean;
  landAcres: number;
  notes?: string;
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

/* =========================================================================
   Family Members Management API
   ========================================================================= */

export async function fetchFamilyMembers(userId?: string): Promise<FamilyMemberData[]> {
  try {
    const url = userId ? `${API_BASE_URL}/family?userId=${userId}` : `${API_BASE_URL}/family`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn('Failed to fetch family members from backend:', err);
  }
  return [];
}

export async function addFamilyMember(member: FamilyMemberData): Promise<FamilyMemberData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('Failed to add family member:', err);
  }
  return null;
}

export async function updateFamilyMember(id: string, member: Partial<FamilyMemberData>): Promise<FamilyMemberData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/family/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error(`Failed to update family member ${id}:`, err);
  }
  return null;
}

export async function deleteFamilyMember(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/family/${id}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch (err) {
    console.error(`Failed to delete family member ${id}:`, err);
  }
  return false;
}
