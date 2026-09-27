export interface Deal {
  id: number;
  name: string;
  status: string;
}

export interface Interaction {
  id: number;
  content: string;
  timestamp: string;
  interaction_type: string;
}

export interface InteractionCreate {
  deal_id: number;
  content: string;
  interaction_type?: string;
}

export interface BriefingResponse {
  briefing: string;
  risk: {
    score: 'Low' | 'Medium' | 'High';
    reason: string;
  };
  evidence_count: number;
}
