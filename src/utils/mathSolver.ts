// Math parsing and solving utilities

import { create, all } from 'mathjs';

// Configure mathjs
const math = create(all, {});

export type MathResult = {
  originalExpression: string;
  steps: string[];
  solution: string | number | null;
  error?: string;
  type: 'equation' | 'expression' | 'simplification' | 'unknown';
};

export const solveMath = (input: string): MathResult => {
  // Remove excess whitespace
  const cleanedInput = input.trim();
  
  try {
    // Check if it's an equation (contains =)
    if (cleanedInput.includes('=')) {
      return solveEquation(cleanedInput);
    }
    
    // Otherwise treat as expression to evaluate
    return evaluateExpression(cleanedInput);
  } catch (error) {
    return {
      originalExpression: cleanedInput,
      steps: [`Error analyzing input: ${(error as Error).message}`],
      solution: null,
      error: (error as Error).message,
      type: 'unknown'
    };
  }
};

const solveEquation = (equation: string): MathResult => {
  const parts = equation.split('=');
  
  if (parts.length !== 2) {
    return {
      originalExpression: equation,
      steps: ['Invalid equation format. Please use x = y format.'],
      solution: null,
      error: 'Invalid equation format',
      type: 'equation'
    };
  }
  
  try {
    // Create steps for solving
    const steps: string[] = [`Starting with: ${equation}`];
    
    // Check for variables in the equation
    const leftSide = parts[0].trim();
    const rightSide = parts[1].trim();
    
    // Simple case: Check if it's a linear equation with one variable
    // This is a simplified implementation - a real solver would be more complex
    const variables = findVariables(equation);
    
    if (variables.length === 1) {
      const variable = variables[0];
      steps.push(`Solving for ${variable}`);
      
      // Move all terms with the variable to the left side
      // Move all other terms to the right side
      const simplifiedEquation = solveLinearEquation(leftSide, rightSide, variable);
      
      steps.push(`${variable} = ${simplifiedEquation}`);
      
      return {
        originalExpression: equation,
        steps,
        solution: simplifiedEquation,
        type: 'equation'
      };
    } else if (variables.length === 0) {
      // It's just a comparison of two expressions
      const leftValue = math.evaluate(leftSide);
      const rightValue = math.evaluate(rightSide);
      
      steps.push(`Left side evaluates to: ${leftValue}`);
      steps.push(`Right side evaluates to: ${rightValue}`);
      
      const isEqual = Math.abs(leftValue - rightValue) < 1e-10;
      steps.push(`The equation is ${isEqual ? 'valid' : 'invalid'}`);
      
      return {
        originalExpression: equation,
        steps,
        solution: isEqual ? 'True' : 'False',
        type: 'equation'
      };
    } else {
      // Multiple variables or more complex equation
      steps.push('Complex equations with multiple variables require a more sophisticated solver.');
      steps.push('Consider simplifying your equation or specifying which variable to solve for.');
      
      return {
        originalExpression: equation,
        steps,
        solution: null,
        type: 'equation'
      };
    }
  } catch (error) {
    return {
      originalExpression: equation,
      steps: [`Error solving equation: ${(error as Error).message}`],
      solution: null,
      error: (error as Error).message,
      type: 'equation'
    };
  }
};

const evaluateExpression = (expression: string): MathResult => {
  try {
    // Try to simplify the expression
    const simplified = math.simplify(expression).toString();
    
    const steps = [
      `Original expression: ${expression}`
    ];
    
    if (simplified !== expression) {
      steps.push(`Simplified to: ${simplified}`);
    }
    
    // Try to evaluate to a numerical value if possible
    let evaluated;
    try {
      evaluated = math.evaluate(expression);
      steps.push(`Evaluated to: ${evaluated}`);
    } catch (e) {
      // If we can't evaluate to a number, use the simplified form
      evaluated = simplified;
    }
    
    return {
      originalExpression: expression,
      steps,
      solution: evaluated,
      type: 'expression'
    };
  } catch (error) {
    return {
      originalExpression: expression,
      steps: [`Error evaluating expression: ${(error as Error).message}`],
      solution: null,
      error: (error as Error).message,
      type: 'expression'
    };
  }
};

// Helper functions
const findVariables = (equation: string): string[] => {
  // This is a simple implementation to extract variables
  // A more robust implementation would use proper parsing
  const alphaRegex = /[a-zA-Z]+/g;
  const matches = equation.match(alphaRegex) || [];
  
  // Filter out mathematical functions like sin, cos, etc.
  const mathFunctions = ['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'sqrt'];
  const variables = matches.filter(match => !mathFunctions.includes(match));
  
  // Remove duplicates
  return [...new Set(variables)];
};

const solveLinearEquation = (leftSide: string, rightSide: string, variable: string): string => {
  // This is a simplified implementation for basic linear equations
  try {
    // Using mathjs to symbolically solve the equation
    // For example: solve("x + 3 = 5", "x")
    const solution = math.evaluate(`solve(${leftSide} = ${rightSide}, ${variable})`);
    
    if (Array.isArray(solution)) {
      return solution[0].toString();
    }
    
    return solution.toString();
  } catch (error) {
    // If symbolic solving fails, we'll try a very simple approach
    // This is not robust and will only work for very simple equations
    try {
      // Evaluate each side without the variable
      const leftWithoutVar = leftSide.replace(new RegExp(variable, 'g'), '0');
      const rightWithoutVar = rightSide.replace(new RegExp(variable, 'g'), '0');
      
      const leftCoef = math.evaluate(`derivative(${leftSide}, ${variable})`);
      const rightCoef = math.evaluate(`derivative(${rightSide}, ${variable})`);
      
      const leftConst = math.evaluate(leftWithoutVar);
      const rightConst = math.evaluate(rightWithoutVar);
      
      // ax + b = cx + d
      // ax - cx = d - b
      // x(a - c) = d - b
      // x = (d - b)/(a - c)
      const coef = leftCoef - rightCoef;
      const constTerm = rightConst - leftConst;
      
      return (constTerm / coef).toString();
    } catch (e) {
      throw new Error(`Could not solve for ${variable}: ${(error as Error).message}`);
    }
  }
};

// Example usage:
// solveMath("2x + 3 = 7")
// solveMath("3 + 4 * 2")
// solveMath("sin(pi/4)")
