import Authorized from '@/app/(routes)/authorized';
import { validateRequest } from '@/lib/auth/lucia';
import '@/styles/cursor.css';

export default async function HomePage() {
  const { user } = await validateRequest();

  // if (!user) return <Unauthorized />;
  return <Authorized user={user} />;
}
