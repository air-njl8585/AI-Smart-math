
import React from 'react';
import { Sparkles, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 border-b backdrop-blur-sm bg-background/90 sticky top-0 z-10">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse-slow" />
            <h1 className="text-xl font-medium">Algebra Genius</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <Button size="sm" variant="default" className="rounded-full px-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
