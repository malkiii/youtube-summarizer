import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'framer-motion';
import { markdownToText } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { AnimatedContent } from './animated-content';
import { VideoPreview } from './video-preview';

import { ArrowLeftIcon, CopyIcon, CheckIcon, CircleAlertIcon } from 'lucide-react';

export default function Page() {
  const params = useParams();
  const { t, i18n } = useTranslation();

  const { content, isLoading, error } = useSummary(params.id!, i18n.language);

  const errorMessage = useMemo(() => {
    if (!error) return;

    switch (error) {
      case 'INVALID_DATA':
        return t('error.invalid_data');
      case 'BAD_REQUEST':
        return t('error.bad_request');
      case 'UNREACHABLE':
        return t('error.unreachable');
      case 'NO_CAPTIONS':
        return t('error.no_captions');
      case 'GENERATION_FAILED':
        return t('error.later');
      default:
        return t('error.server_error');
    }
  }, [t, error]);

  return (
    <div className="relative mx-auto min-h-dvh max-w-2xl px-4 py-5">
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
        </>
      ) : errorMessage ? (
        <div className="absolute inset-0 content-center">
          <div className="mx-auto flex w-fit -translate-y-full items-center justify-center gap-2 text-balance text-muted-foreground max-sm:flex-col max-sm:text-center">
            <CircleAlertIcon className="block size-7 max-sm:size-10" />
            <p role="alert" className="max-w-lg text-xl">
              {errorMessage}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between animate-in fade-in-0 print:hidden">
            <Button className="gap-2" asChild>
              <Link to={`/${i18n.language}`}>
                <ArrowLeftIcon className="size-5 rtl:-scale-100" /> {t('summary.back')}
              </Link>
            </Button>
            <CopyButton content={content} link={`https://www.youtube.com/watch?v=${params.id}`} />
          </div>
          <AnimatedContent
            key="content"
            content={content ?? ''}
            onAnimationComplete={() => {
              const preview = document.getElementById('player');
              if (preview) preview.style.display = 'block';
            }}
          />
        </>
      )}
      <VideoPreview id={params.id!} preferredLang={i18n.language} style={{ display: 'none' }} />
      <ScrollToTopButton />
    </div>
  );
}

function useSummary(videoId: string, lang = 'en') {
  const [content, setContent] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string>();

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

function CopyButton(props: { link: string; content: string | undefined }) {
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
        if (!props.content) return;
        await navigator.clipboard.writeText(
          markdownToText(props.content).trim() + '\n\n' + `link: ${props.link}`,
        );

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
