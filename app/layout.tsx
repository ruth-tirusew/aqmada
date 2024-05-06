import "./404.css";
import { Montserrat } from 'next/font/google'


export const metadata = {
  title: 'Aqmada',
}

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={
          "bg-background min-h-screen bg-background antialiased " &&
          montserrat.className
        }
      >
          {children}
          {/* <Footer /> */}
      </body>
    </html>
  );
}