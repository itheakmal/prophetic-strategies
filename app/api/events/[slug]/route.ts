import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { getEventBySlug } from '@/lib/services/event-service';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    return successResponse(event);
  } catch (error) {
    return errorResponse(error);
  }
}
