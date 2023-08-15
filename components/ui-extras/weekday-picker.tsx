import { cn } from "@/lib/utils";
import dayjs from "dayjs";

type WeekdayPicker = {
	values: number[];
	onChange: (values: number[]) => void;
};

export function WeekdayPicker({ values, onChange }: WeekdayPicker) {
	return (
		<div className="flex space-x-2">
			{daysOfWeek.map((day) => {
				const dayLabel = day.format("ddd");
				const dayInt = parseInt(day.format("d"));
				return (
					<button
						onClick={(e) => {
							e.preventDefault();
							if (values.includes(dayInt)) {
								onChange(values.filter((v) => v != dayInt));
							} else {
								onChange([...values, dayInt]);
							}
						}}
						className={cn(
							`px-2 bg-white py-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 transition-colors border-slate-200 border rounded-md text-sm`,
							values.includes(dayInt) && `border-slate-600`
						)}
						key={dayInt}
					>
						{dayLabel}
					</button>
				);
			})}
		</div>
	);
}

const daysOfWeek = Array.from({ length: 7 }, (_, index) => dayjs().day(index));
