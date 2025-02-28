
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle } from "lucide-react";
import { MathResult as MathResultType } from '../utils/mathSolver';

interface MathResultProps {
  result: MathResultType;
}

const MathResult: React.FC<MathResultProps> = ({ result }) => {
  const { originalExpression, steps, solution, error, type } = result;
  
  const isSuccess = !error && solution !== null;
  
  return (
    <div className="result-container w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="chip bg-secondary text-secondary-foreground">
          {type === 'equation' ? 'Equation' : type === 'expression' ? 'Expression' : 'Simplification'}
        </div>
        {isSuccess ? (
          <div className="chip bg-green-100 text-green-800 flex items-center gap-1">
            <Check className="h-3 w-3" /> Solved
          </div>
        ) : (
          <div className="chip bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Incomplete
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-2">Original Problem</h3>
      <Card className="mb-4">
        <CardContent className="p-4">
          <code className="equation-container">{originalExpression}</code>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-medium mb-2">Solution Steps</h3>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-3">
          {steps.map((step, idx) => (
            <div key={idx} className="py-1">
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-base">{step}</p>
              </div>
              {idx < steps.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {isSuccess && solution !== null && (
        <>
          <h3 className="text-lg font-medium mb-2">Final Answer</h3>
          <Card className="bg-gradient-to-r from-gray-50 to-white border shadow-sm">
            <CardContent className="p-4">
              <div className="font-mono text-xl p-2 rounded-lg bg-white border shadow-sm overflow-x-auto">
                {solution.toString()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MathResult;
