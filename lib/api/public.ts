export interface EventCard {
  slug: string;
  title: string;
  location: string;
  era: string;
  summary: string;
  href: string;
  status: 'Live' | 'Soon';
}

export interface EventDetail {
  slug: string;
  title: string;
  location: string;
  era: string;
  context: string;
  summary: string;
  deeper: string[];
  lessons: string[];
  parallels: string[];
  quotes: Array<{
    subtitle: string;
    text: string;
    source: string;
    details?: string;
  }>;
  media: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    poster?: string;
  }>;
  followups?: {
    action: {
      prompt: string;
      type: 'dropdown' | 'mcq';
      choices: string[];
      correctIndex: number;
      explanation: string;
    };
    reaction: {
      prompt: string;
      type: 'dropdown' | 'mcq';
      choices: string[];
      correctIndex: number;
      explanation: string;
    };
  };
}

export interface TribesGraphData {
  nodes: Array<Record<string, any>>;
  links: Array<Record<string, any>>;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload.data as T;
}

export async function fetchEventCards(): Promise<EventCard[]> {
  const response = await fetch('/api/events', { cache: 'no-store' });
  return parseResponse<EventCard[]>(response);
}

export async function fetchEventDetail(slug: string): Promise<EventDetail> {
  const response = await fetch(`/api/events/${slug}`, { cache: 'no-store' });
  return parseResponse<EventDetail>(response);
}

export async function fetchTribesGraph(phase = 'meccan'): Promise<TribesGraphData> {
  const response = await fetch(`/api/tribes?phase=${encodeURIComponent(phase)}`, {
    cache: 'no-store',
  });
  return parseResponse<TribesGraphData>(response);
}
