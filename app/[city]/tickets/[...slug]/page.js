import Hall from '@/components/tickets/Hall.jsx';
import Header from '@/components/tickets/Header.jsx';

export const metadata = {
  title: 'مسرحية غِريس في دبي أوبرا الجمعة 24 اكتوبر 2025 - مسرحية غِريس في دبي أوبرا الجمعة 24 اكتوبر 2025 - Platinumlist.net',
  other: {
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#da532c',
    'theme-color': '#ffffff',
  },
  openGraph: {
    type: 'website',
  },
  icons: {
    icon: [
      { url: 'https://platinumlist.net/favicon.ico', type: 'image/x-icon' },
      { url: 'https://platinumlist.net/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://platinumlist.net/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: 'https://platinumlist.net/favicon.ico',
    apple: { url: 'https://platinumlist.net/apple-touch-icon.png', sizes: '180x180' },
    other: [
      { rel: 'mask-icon', url: 'https://platinumlist.net/safari-pinned-tab.svg' },
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  alternates: {
    canonical: 'https://dubai.platinumlist.net/hall-map/ticket-office?id_event_show=3506772',
    languages: {
      'x-default': 'https://dubai.platinumlist.net/hall-map/ticket-office?id_event_show=3506772',
      'en': 'https://dubai.platinumlist.net/hall-map/ticket-office?id_event_show=3506772',
      'ar': 'https://dubai.platinumlist.net/ar/hall-map/ticket-office?id_event_show=3506772',
      'tr': 'https://dubai.platinumlist.net/tr/hall-map/ticket-office?id_event_show=3506772',
    },
  },
};

export default function Tickits(){
  return (
    <>
      <Header />
      <Hall />
    </>  
  );
}