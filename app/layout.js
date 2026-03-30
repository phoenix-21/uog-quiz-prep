import "./globals.css"; // 🔴 THIS LINE IS REQUIRED

export const metadata = {
  title: "Quiz App",
  description: "Academic Quiz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
