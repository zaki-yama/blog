import { SITE_CONFIG } from '../../lib/site-config';
import { renderOgImage } from '../../lib/og-image';

export async function GET() {
  return renderOgImage({
    title: SITE_CONFIG.name,
    subtitle: SITE_CONFIG.description,
    footerText: SITE_CONFIG.name,
  });
}
