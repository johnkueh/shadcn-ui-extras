"use client";

import { Stepper, StepperStep } from "@/components/ui-extras/stepper";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DemoStepper() {
	const [currentStep, setCurrentStep] = useState(0);

	return (
		<div className="space-y-3">
			<Stepper
				active={currentStep}
				onStepClick={(step) => setCurrentStep(step)}
			>
				<StepperStep label="First">
					<p>First step content</p>
				</StepperStep>
				<StepperStep label="Second">
					<p>Second step content</p>
				</StepperStep>
				<StepperStep label="Third">
					<p>Third step content</p>
				</StepperStep>
			</Stepper>
			<Button
				size="sm"
				onClick={() => currentStep < 2 && setCurrentStep(currentStep + 1)}
			>
				Next
			</Button>
		</div>
	);
}
