
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background text-muted-foreground border-t border-border/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="footer-section about">
            <h4 className="text-lg font-semibold text-primary mb-4">{t('About We Go')}</h4>
            <p className="text-sm">
              <Trans i18nKey="At <1>We Go</1>, we connect car-owners and renters in Rwanda to make mobility simple, safe and reliable. Whether you’re travelling for business or leisure, find your ride — or list your car — in a few clicks.">
                At <strong>We Go</strong>, we connect car-owners and renters in Rwanda to make mobility simple, safe and reliable. Whether you’re travelling for business or leisure, find your ride — or list your car — in a few clicks.
              </Trans>
            </p>
          </div>

          <div className="footer-section quick-links">
            <h4 className="text-lg font-semibold text-primary mb-4">{t('Quick Links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/cars" className="hover:text-primary transition-colors">{t('Browse Cars')}</a></li>
              <li><a href="/map" className="hover:text-primary transition-colors">{t('Map View')}</a></li>
              <li><a href="/how-it-works" className="hover:text-primary transition-colors">{t('How It Works')}</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">{t('FAQ')}</a></li>
              <li><a href="/blog" className="hover:text-primary transition-colors">{t('Blog')}</a></li>
            </ul>
          </div>

          <div className="footer-section legal">
            <h4 className="text-lg font-semibold text-primary mb-4">{t('Legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="hover:text-primary transition-colors">{t('Terms & Conditions')}</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">{t('Privacy Policy')}</a></li>
              <li><a href="/safety" className="hover:text-primary transition-colors">{t('Safety & Insurance')}</a></li>
            </ul>
          </div>

          <div className="footer-section contact-social">
            <h4 className="text-lg font-semibold text-primary mb-4">{t('Get in Touch')}</h4>
            <p className="text-sm">
              <Trans i18nKey="Email: <1>support@wego.rw</1>">
                Email: <a href="mailto:support@wego.rw" className="hover:text-primary transition-colors">support@wego.rw</a>
              </Trans>
            </p>
            <p className="text-sm">
              <Trans i18nKey="Phone: <1>+250 12 345 6789</1>">
                Phone: <a href="tel:+250123456789" className="hover:text-primary transition-colors">+250 12 345 6789</a>
              </Trans>
            </p>
            <div className="flex space-x-2 mt-4 text-sm">
              <a href="https://facebook.com/wego.rw" target="_blank" rel="noopener" className="hover:text-primary transition-colors">{t('Facebook')}</a>
              <span>|</span>
              <a href="https://instagram.com/wego.rw" target="_blank" rel="noopener" className="hover:text-primary transition-colors">{t('Instagram')}</a>
              <span>|</span>
              <a href="https://twitter.com/wego_rw" target="_blank" rel="noopener" className="hover:text-primary transition-colors">{t('Twitter')}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>{t('© 2025 We Go. All rights reserved.')}</p>
          <p>{t('Built with ❤️ by We Go.')}</p>
        </div>
      </div>
    </footer>
  );
}
