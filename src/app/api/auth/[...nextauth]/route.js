import { handlers } from '@/lib/auth';

export async function GET(req) {
  return handlers.GET(req);
}

export async function POST(req) {
  return handlers.POST(req);
}
