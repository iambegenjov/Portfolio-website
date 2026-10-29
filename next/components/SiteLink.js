import Link from 'next/link';
import { PREVIEW, pageHref } from '@/lib/paths';

// next/link on the real site; plain links in the static preview, where pages load as files
export default function SiteLink({ href, ...rest }) {
  if (PREVIEW) return <a href={pageHref(href)} {...rest} />;
  return <Link href={href} {...rest} />;
}
