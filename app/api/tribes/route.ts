import { errorResponse, successResponse } from '@/lib/errors';
import { getTribesGraph } from '@/lib/services/tribe-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase') ?? 'meccan';
    const graph = await getTribesGraph(phase);
    return successResponse(graph);
  } catch (error) {
    return errorResponse(error);
  }
}
