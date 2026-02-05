import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "ตารางเวรปฏิบัติงาน",
    description: "Hospital shift calendar management system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <head>
                <link
                    href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.15/main.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.15/main.min.css"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
