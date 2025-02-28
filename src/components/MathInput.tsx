
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles } from "lucide-react";

interface MathInputProps {
  onSolve: (input: string) => void;
  isProcessing: boolean;
}

const MathInput: React.FC<MathInputProps> = ({ onSolve, isProcessing }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSolve(input.trim());
    }
  };

  const exampleInputs = [
    "2x + 3 = 7",
    "x^2 - 4 = 0",
    "sqrt(16) + 5",
    "(3 + 4) * (2 - 1)",
    "5 * sin(pi/4)",
  ];

  const handleExampleClick = (example: string) => {
    setInput(example);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.max(56, inputRef.current.scrollHeight)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-1">
        <div className="chip mb-2">Enter a math problem</div>
        <h2 className="text-2xl font-medium mb-4">What would you like to solve?</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter an equation like '2x + 3 = 7' or expression like '3 + 4 * 2'"
            className="math-input min-h-14 pr-12 resize-none"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="absolute right-3 bottom-3 rounded-full h-8 w-8 transition-all duration-200"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleInputs.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-sm px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MathInput;
