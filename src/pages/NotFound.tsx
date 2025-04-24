
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-9xl font-extrabold text-brand-500">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
