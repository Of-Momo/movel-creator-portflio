import "../(site)/globals.css";

export const metadata = { title: "Manage | MOVEL", robots: { index: false, follow: false } };

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body
        className="font-body"
        style={{
          margin: 0,
          background: "#F4EDE4",
          color: "#1C1512",
          ["--font-headline" as string]: "'Bodoni Moda', serif",
          ["--font-body" as string]: "'DM Sans', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
