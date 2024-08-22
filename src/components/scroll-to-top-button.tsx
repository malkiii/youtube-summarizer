import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { ArrowUpIcon } from 'lucide-react';

export function ScrollToTopButton() {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsPast(window.scrollY > 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-8 right-4 z-[99] size-12 shadow-xl transition-transform duration-300',
        isPast ? '' : 'translate-y-24',
      )}
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  );
}
