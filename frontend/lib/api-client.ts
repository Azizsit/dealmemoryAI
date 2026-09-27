import { Deal as TDeal, Interaction as TInteraction, InteractionCreate as TInteractionCreate, BriefingResponse as TBriefingResponse } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }

  return response.json();
}

export const dealService = {
  async listDeals() {
    return apiFetch<TDeal[]>('/deals');
  },
  async createDeal(data: { name: string }) {
    return apiFetch<TDeal>('/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getDeal(id: number) {
    return apiFetch<TDeal>(`/deals/${id}`);
  },
};

export const interactionService = {
  async createInteraction(data: TInteractionCreate) {
    return apiFetch<TInteraction>('/interactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export const briefingService = {
  async getBriefing(dealId: number) {
    return apiFetch<TBriefingResponse>(`/briefings/${dealId}/briefing`);
  },
};
