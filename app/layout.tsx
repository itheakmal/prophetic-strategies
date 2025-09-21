import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Hilf al-Fudul – Interactive UI',
  description: 'Interactive learning UI for the Pact of the Virtuous',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
