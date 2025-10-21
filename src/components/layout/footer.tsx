
import { Logo } from "@/components/logo";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('Built by you. Powered by Firebase and Google AI.')}
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} {t('We Go. All rights reserved.')}
        </p>
      </div>
    </footer>
  );
}
