import "./globals.css";

export const metadata = { title: "Holiday Planner" };

// Root layout – Person A owns this file and will replace it.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
