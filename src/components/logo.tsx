import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'to'> & {};

export function Logo({ className, ...props }: LogoProps) {
  const { t, i18n } = useTranslation();

  return (
    <Link
      to={`/${i18n.language}`}
      {...props}
      className={cn('group flex w-fit select-none gap-2', className)}
    >
      <svg width="45" viewBox="0 0 130 91" fill="none" className="pointer-events-none">
        <g clipPath="url(#clip0_501_5)">
          <path
            d="M127.282 14.2115C125.784 8.61463 121.386 4.21635 115.789 2.71815C105.655 8.13644e-07 65 0 65 0C65 0 24.3456 8.13644e-07 14.2114 2.71815C8.61463 4.21635 4.21635 8.61463 2.71815 14.2115C8.13644e-07 24.3456 0 45.5023 0 45.5023C0 45.5023 8.13644e-07 66.659 2.71815 76.7933C4.21635 82.3901 8.61463 86.7883 14.2114 88.2862C24.3456 91.0045 65 91.0046 65 91.0046C65 91.0046 105.655 91.0045 115.789 88.2862C121.386 86.7883 125.784 82.3901 127.282 76.7933C130 66.659 130 45.5023 130 45.5023C130 45.5023 129.99 24.3456 127.282 14.2115Z"
            fill="#FF0000"
          />
          <path d="M114 31H46V41H114V31Z" fill="white" />
          <path d="M36 31H16V41H36V31Z" fill="white" />
          <path d="M16 51H84V61H16V51Z" fill="white" />
          <path d="M94 51H114V61H94V51Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_501_5">
            <rect width="130" height="91" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <div className="group relative w-[4.4rem] text-xl font-semibold *:absolute *:top-1/2 *:transition-all *:duration-200 ltr:*:left-0 rtl:*:right-0">
        <span className="-translate-y-1/2 group-hover:-translate-y-full group-hover:opacity-0">
          YTS
        </span>
        <span className="opacity-0 group-hover:-translate-y-1/2 group-hover:opacity-100">
          {t('logo')}
        </span>
      </div>
    </Link>
  );
}
