import { LandingNav } from '@/components/landing/LandingNav';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <LandingNav />
            <main className="flex-1 w-full">
                {children}
            </main>
            <footer className="border-t border-border py-6 bg-muted/30">
                <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                    <p>© 2024 LedgerSync. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
