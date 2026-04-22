import { errorResponse, successResponse } from '@/lib/errors';
import { listEvents } from '@/lib/services/event-service';

export async function GET() {
  try {
    const events = await listEvents();
    return successResponse(events);
  } catch (error) {
    return errorResponse(error);
  }
}
