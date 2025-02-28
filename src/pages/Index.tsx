
import React, { useState } from 'react';
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MathInput from "@/components/MathInput";
import MathResult from "@/components/MathResult";
import { solveMath, MathResult as MathResultType } from "@/utils/mathSolver";
import { Sparkles, PlusCircle, Brain, Calculator } from "lucide-react";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MathResultType | null>(null);
  const [history, setHistory] = useState<MathResultType[]>([]);

  const handleSolve = (input: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      try {
        const solution = solveMath(input);
        setResult(solution);
        setHistory(prev => [solution, ...prev].slice(0, 5));
        
        if (solution.error) {
          toast.error("Couldn't solve this problem completely", {
            description: solution.error
          });
        } else {
          toast.success("Problem solved!", {
            description: "Check out the step-by-step solution below."
          });
        }
      } catch (error) {
        toast.error("Something went wrong", {
          description: (error as Error).message
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const features = [
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "AI-Powered Solutions",
      description: "Our advanced algorithms solve algebra problems with step-by-step explanations."
    },
    {
      icon: <Calculator className="h-5 w-5 text-green-500" />,
      title: "Comprehensive Math Support",
      description: "From basic arithmetic to complex algebraic equations, we've got you covered."
    },
    {
      icon: <PlusCircle className="h-5 w-5 text-blue-500" />,
      title: "Learn While Solving",
      description: "Understand concepts better with our detailed solution breakdowns."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <section className="mb-16 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
              Algebra made simple
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Solve math problems with 
            <span className="relative inline-block ml-2">
              AI precision
              <div className="absolute -top-1 -right-2">
                <Sparkles className="h-5 w-5 text-amber-400 animate-float" />
              </div>
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get step-by-step solutions for algebra equations, expressions, and more with our powerful math solving engine.
          </p>
          
          <div className="relative mb-12">
            <MathInput onSolve={handleSolve} isProcessing={isProcessing} />
          </div>
          
          {isProcessing && (
            <div className="my-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg animate-pulse">
                <Sparkles className="h-5 w-5 text-primary animate-spin" />
                <span>Solving your problem...</span>
              </div>
            </div>
          )}
          
          {result && !isProcessing && (
            <div className="animate-slide-up">
              <MathResult result={result} />
            </div>
          )}
        </section>
        
        <section className="py-12 border-t">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Use Algebra Genius?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm transition-transform duration-300 hover:translate-y-[-5px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {history.length > 0 && (
          <section className="py-12 border-t">
            <h2 className="text-2xl font-bold mb-8">Recent Solutions</h2>
            
            <div className="space-y-4">
              {history.slice(1).map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg border bg-white cursor-pointer hover:border-primary/50 transition-colors duration-200"
                  onClick={() => setResult(item)}
                >
                  <div className="flex justify-between items-center">
                    <code className="font-mono">{item.originalExpression}</code>
                    <div className="chip bg-secondary text-secondary-foreground">
                      {item.type === 'equation' ? 'Equation' : 'Expression'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
