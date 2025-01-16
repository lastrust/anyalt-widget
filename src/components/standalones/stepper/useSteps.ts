import React from 'react';

type UseSteps = {
  initialStep?: number;
  initialScenario?: number;
  stepsAmount: number;
};

type UseStepsReturnValue = {
  activeStep: number;
  currentScenario: number;
  amount: number;
  nextStep(): void;
  prevStep(): void;
  reset(): void;
  setStep(step: number): void;
  setScenario(branch: number): void;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
};
export const useSteps = ({
  initialStep = 0,
  initialScenario = 0,
  stepsAmount,
}: UseSteps): UseStepsReturnValue => {
  const [activeStep, setActiveStep] = React.useState(initialStep);
  const [currentScenario, setCurrentScenario] = React.useState(initialScenario);
  const [amount, setAmount] = React.useState(stepsAmount);

  const nextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const reset = () => {
    setActiveStep(initialStep);
  };

  const setStep = (step: number) => {
    setActiveStep(step);
  };

  const setScenario = (scenario: number) => {
    if (scenario >= 0) setCurrentScenario(scenario);
  };

  return {
    nextStep,
    prevStep,
    reset,
    setStep,
    setAmount,
    setScenario,
    activeStep,
    currentScenario,
    amount,
  };
};
