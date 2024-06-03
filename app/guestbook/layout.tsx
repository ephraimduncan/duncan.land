import { Button } from "@/components/button";
import { auth } from "@/lib/auth";
import { SignDialog } from "./sign-dialog";
import { logout } from "@/lib/actions/logout";
import { MotionDiv } from "@/components/motion";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SignOutIcon } from "@/components/ui/SignoutIcon";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const { user } = await auth();

    const variant = {
        hidden: { opacity: 0, y: -5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: -5, transition: { delay: 0.2 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    };

    return (
        <section>
            <MotionDiv initial="hidden" animate="visible" variants={variant} className="space-y-4">
                <h1 className="font-medium text-2xl tracking-tighter">Sign my guestbook</h1>

                {user ? (
                    <div className="flex w-full justify-between items-center">
                        <SignDialog user={user} />
                        <form action={logout}>
                            <Button plain type="submit">
                                <SignOutIcon />
                                Sign out
                            </Button>
                        </form>
                    </div>
                ) : (
                    <Button href="/login/github" color="light">
                        <GithubIcon />
                        Sign in with GitHub
                    </Button>
                )}
            </MotionDiv>

            <MotionDiv initial="hidden" animate="visible" variants={cardVariants} className="space-y-4">
                {children}
            </MotionDiv>
        </section>
    );
}
