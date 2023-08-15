import { LoaderButton } from '@/components/ui-extras/loader-button';
import { Mail } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { DemoDatePicker } from './DemoDatePicker';
import { DemoRichTextEditor } from './DemoRichTextEditor';
import { DemoStepper } from './DemoStepper';
import { DemoWeekdayPicker } from './DemoWeekdayPicker';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-12">
      <h1 className="text-3xl font-bold">shadcn-ui-extras</h1>
      <div className="mt-8 space-y-5">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Button with icon and loading states</h2>
          <div className="flex items-center space-x-3">
            <LoaderButton isLoading={false}>Submit</LoaderButton>
            <LoaderButton isLoading={true}>Submit</LoaderButton>
            <LoaderButton icon={Mail}>Submit</LoaderButton>
            <LoaderButton icon={Mail} isLoading={true}>
              Submit
            </LoaderButton>
          </div>
          <CodeBlock
            permalink="https://github.com/johnkueh/shadcn-ui-extras/blob/6e06a009d90d1ac3f2739d87945627a5c0f02c91/app/page.tsx#L17-L22"
            code={`<LoaderButton isLoading={false}>Submit</LoaderButton>
<LoaderButton isLoading={true}>Submit</LoaderButton>
<LoaderButton icon={Mail}>Submit</LoaderButton>
<LoaderButton icon={Mail} isLoading={true}>
  Submit
</LoaderButton>`}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Datetime picker&nbsp;
            <a
              href="https://day.js.org/"
              target="_new"
              className="text-sm text-blue-500 font-normal">
              dayjs dependency
            </a>
          </h2>
          <div className="flex items-center space-x-3">
            <DemoDatePicker />
          </div>
          <CodeBlock
            permalink="https://github.com/johnkueh/shadcn-ui-extras/blob/6e06a009d90d1ac3f2739d87945627a5c0f02c91/app/DemoDatePicker.tsx#L9"
            code={`<DateTimeSelect
  value={new Date("2022-11-17T09:00:00")}
  onChange={(datetime) => {
    console.log(datetime);
  }}
/>`}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Weekday picker&nbsp;
            <a
              href="https://day.js.org/"
              target="_new"
              className="text-sm text-blue-500 font-normal">
              dayjs dependency
            </a>
          </h2>
          <div className="flex items-center space-x-3">
            <DemoWeekdayPicker />
          </div>
          <CodeBlock
            permalink="https://github.com/johnkueh/shadcn-ui-extras/blob/6e06a009d90d1ac3f2739d87945627a5c0f02c91/app/DemoWeekdayPicker.tsx#L9"
            code={`<WeekdayPicker values={[1, 2]} onChange={(values) => console.log(values)} />`}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Lexical rich-text editor&nbsp;
            <span className="text-sm font-normal">
              <a
                href="https://lexical.dev/"
                target="_new"
                className="text-sm text-blue-500 font-normal">
                Lexical
              </a>
              ,&nbsp;
              <a
                href="https://tailwindcss.com/docs/typography-plugin"
                target="_new"
                className="text-sm text-blue-500 font-normal">
                @tailwind/typography
              </a>
              &nbsp;dependencies
            </span>
          </h2>
          <div className="flex items-center space-x-3">
            <DemoRichTextEditor />
          </div>
          <CodeBlock
            permalink="https://github.com/johnkueh/shadcn-ui-extras/blob/6e06a009d90d1ac3f2739d87945627a5c0f02c91/app/DemoRichTextEditor.tsx#L6"
            code={`<RichTextEditor defaultValue={""} onChange={(value) => console.log(value)} />`}
          />
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Stepper</h2>
          <div className="flex items-center space-x-3">
            <DemoStepper />
          </div>
          <CodeBlock
            permalink="https://github.com/johnkueh/shadcn-ui-extras/blob/6e06a009d90d1ac3f2739d87945627a5c0f02c91/app/DemoStepper.tsx#L12-L25"
            code={`<Stepper
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
</Stepper>`}
          />
        </div>
      </div>
    </main>
  );
}
