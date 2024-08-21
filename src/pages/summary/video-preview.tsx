type VideoPreviewProps = React.ComponentPropsWithoutRef<'iframe'> & {
  id: string;
  preferredLang?: string;
};

export function VideoPreview({ id, preferredLang, ...props }: VideoPreviewProps) {
  return (
    <iframe
      {...props}
      id="player"
      width="100%"
      frameBorder={0}
      src={`https://www.youtube.com/embed/${id}?cc_lang_pref=${preferredLang || 'en'}`}
      className="mx-auto block aspect-video max-w-full rounded-2xl border print:[display:none!important]"
      allow="encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}
