import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User2 } from 'lucide-react';
import { Button } from './ui/button';
import LichessLogo from './ui/lichess-logo';
import * as React from 'react';
import { AuthSession } from '@/lib/auth/utils';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';

export interface AuthButtonProps {
  authSession?: AuthSession | null;
  className: string;
}

export default function AuthButton({
  className,
  authSession,
}: AuthButtonProps) {

  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });

    if (response.status === 0) {
      return router.refresh();
    }
  };

  if (!authSession?.session) {
    return (
      <div className={className}>
        <Link href="/login/lichess">
        <Button
          className={`flex-row gap-2 p-2`}
          variant="ghost"
        >
          <LichessLogo size="24" />
          sign in
        </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="select-none gap-2 p-3">
            <User2 />
            {authSession?.session?.user.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex w-max justify-end"
          onClick={handleSignOut}
        >
          <DropdownMenuItem className="flex w-full justify-center">
            sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
