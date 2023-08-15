"use client";

import { ExternalLink } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

type CodeBlock = {
	code: string;
	permalink: string;
};

export function CodeBlock({ code, permalink }: CodeBlock) {
	return (
		<div className="relative">
			<Highlight theme={themes.github} code={code} language="tsx">
				{({ className, style, tokens, getLineProps, getTokenProps }) => (
					<pre style={style} className="p-3 text-sm">
						{tokens.map((line, i) => (
							<div key={i} {...getLineProps({ line })}>
								{line.map((token, key) => (
									<span key={key} {...getTokenProps({ token })} />
								))}
							</div>
						))}
					</pre>
				)}
			</Highlight>
			<a
				target="_new"
				href={permalink}
				className="text-sm absolute right-2 top-2 flex items-center text-blue-500 space-x-2"
			>
				<div>View on Github</div>
				<ExternalLink size={16} />
			</a>
		</div>
	);
}
