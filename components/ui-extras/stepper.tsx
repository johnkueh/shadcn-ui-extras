import * as ProgressTabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronRight, CircleDashed, CircleDotDashed } from 'lucide-react';

const ProgressTabs = ProgressTabsPrimitive.Root;

const ProgressTabsList = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <ProgressTabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex space-x-3 h-9 items-center justify-center text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      className
    )}
    {...props}
  />
));
ProgressTabsList.displayName = ProgressTabsPrimitive.List.displayName;

const ProgressTabsTrigger = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <ProgressTabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'py-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-slate-950',
      'dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50',

      className
    )}
    {...props}
  />
));
ProgressTabsTrigger.displayName = ProgressTabsPrimitive.Trigger.displayName;

const ProgressTabsContent = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ProgressTabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-800',
      className
    )}
    {...props}
  />
));
ProgressTabsContent.displayName = ProgressTabsPrimitive.Content.displayName;

type Stepper = {
  active: number;
  onStepClick: (step: number) => void;
  children: React.ReactNode;
};

export function Stepper({ active, children, onStepClick }: Stepper) {
  const steps =
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return null;

      return child.props.label as string;
    })?.filter(Boolean) ?? [];

  const activeValue = steps[active];

  return (
    <ProgressTabs
      value={activeValue}
      onValueChange={(value) => {
        onStepClick(steps.indexOf(value));
      }}>
      <ProgressTabsList className="space-x-0">
        {steps.map((step, index) => {
          const isActive = step === activeValue;
          const isCompleted = steps.indexOf(step) < active;
          return (
            <ProgressTabsTrigger key={step} value={step}>
              <div className="flex items-center space-x-1">
                {isActive ? (
                  <CircleDotDashed size={16} />
                ) : isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <CircleDashed size={16} />
                )}

                <div>{step}</div>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-2">
                  <ChevronRight size={18} />
                </div>
              )}
            </ProgressTabsTrigger>
          );
        })}
      </ProgressTabsList>

      {steps.map((step, index) => (
        <ProgressTabsContent key={step} value={step}>
          {React.Children.toArray(children)[index]}
        </ProgressTabsContent>
      ))}
    </ProgressTabs>
  );
}

type StepperStep = {
  label: string;
  children: React.ReactNode;
};

export function StepperStep({ label, children }: StepperStep) {
  return <ProgressTabsContent value={label}>{children}</ProgressTabsContent>;
}
