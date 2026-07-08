import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-padding mx-auto text-center max-w-md">
        <h1 className="text-[8rem] md:text-[12rem] font-bold leading-none text-gradient">404</h1>
        <h2 className="heading-lg mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <button className="btn-primary">Go Home</button>
        </Link>
      </div>
    </div>
  );
}
