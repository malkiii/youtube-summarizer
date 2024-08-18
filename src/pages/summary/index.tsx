import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'framer-motion';
import { markdownToText } from '@/lib/utils';

import { VideoPreview } from './video-preview';
import { AnimatedContent } from './animated-content';
import { Button } from '@/components/ui/button';

import { ArrowLeftIcon, CopyIcon, CheckIcon } from 'lucide-react';

export default function Page() {
  const params = useParams();
  const { t, i18n } = useTranslation();

  const { content, isLoading, error } = useSummary(params.id!, i18n.language);

  return (
    <div className="mx-auto mb-16 min-h-[calc(100dvh-10rem)] max-w-2xl">
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="pt-8">
          <div className="flex items-center justify-between animate-in fade-in-0">
            <Button asChild>
              <Link to={`/${i18n.language}`}>
                <ArrowLeftIcon className="mr-2 size-5 rtl:-scale-100" /> {t('summary.back')}
              </Link>
            </Button>
            <CopyButton content={content} />
          </div>
          <AnimatedContent
            key="content"
            content={content ?? ''}
            onAnimationComplete={() => {
              const preview = document.getElementById('player');
              if (preview) preview.style.display = 'block';
            }}
          />
        </div>
      )}
      <VideoPreview id={params.id!} preferredLang={i18n.language} style={{ display: 'none' }} />
    </div>
  );
}

function useSummary(videoId: string, lang = 'en') {
  const [content, setContent] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    if (!videoId || content) return;

    setIsLoading(true);
    setError(undefined);

    const controller = new AbortController();
    const searchParams = new URLSearchParams({ videoId, lang });

    (async () => {
      try {
        const response = await fetch(`/summerize?${searchParams}`, { signal: controller.signal });
        if (!response.ok) throw new Error(await response.text());

        const text = await response.text();

        setContent(text.replace(/^\*\*(.+)\*\*$/gm, '### $1'));
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return { content, isLoading, error };
}

function CopyButton({ content }: { content: string | undefined }) {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const ClipboardIcon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      variant="outline"
      size="icon"
      title={t('summary.copy')}
      aria-label={t('summary.copy')}
      onClick={async () => {
        if (!content) return;
        await navigator.clipboard.writeText(markdownToText(content));

        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }}
    >
      <ClipboardIcon className="size-4" />
    </Button>
  );
}

function Skeleton() {
  const getVariant = (maxWidth = 100): Variants => ({
    hidden: { width: '0px' },
    visible: {
      width: `${getRandomInt(70, maxWidth)}%`,
      transition: { duration: 0.3, ease: 'circInOut' },
    },
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.07 }}
      className="mb-8 mt-[3em] grid w-full gap-3 *:h-[1lh] *:animate-pulse *:bg-foreground/10"
    >
      <motion.div style={{ height: '1.4lh' }} className="mb-4" variants={getVariant(75)} />
      <motion.div variants={getVariant()} />
      <motion.div variants={getVariant()} />
      <motion.div variants={getVariant()} />
      <motion.div variants={getVariant()} />
    </motion.div>
  );
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
