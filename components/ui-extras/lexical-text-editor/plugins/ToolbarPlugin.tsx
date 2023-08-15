"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { $isLinkNode, toggleLink } from "@lexical/link";
import {
	$isListNode,
	ListNode,
	insertList,
	type ListType,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createHeadingNode,
	$createQuoteNode,
	$isHeadingNode,
	$isQuoteNode,
	HeadingTagType,
} from "@lexical/rich-text";
import { $isAtNodeEnd, $setBlocksType } from "@lexical/selection";
import {
	$findMatchingParent,
	$getNearestNodeOfType,
	mergeRegister,
} from "@lexical/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	ElementNode,
	FORMAT_TEXT_COMMAND,
	INDENT_CONTENT_COMMAND,
	OUTDENT_CONTENT_COMMAND,
	REDO_COMMAND,
	RangeSelection,
	TextNode,
	UNDO_COMMAND,
} from "lexical";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Indent,
	Italic,
	Link,
	List,
	ListOrdered,
	LucideIcon,
	Outdent,
	Quote,
	Redo,
	Strikethrough,
	Undo,
} from "lucide-react";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";

export default function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const [linkUrl, setLinkUrl] = useState<string | null>(null);
	const [isEditingLink, setIsEditingLink] = useState(false);
	const [toolbarState, setToolbarState] = useState({
		isBold: false,
		isItalic: false,
		isStrikethrough: false,
		isLink: false,
		isHeading1: false,
		isHeading2: false,
		isQuote: false,
		isCode: false,
		isBulletList: false,
		isNumberList: false,
		canUndo: false,
		canRedo: false,
	});

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();

		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === "root"
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
					  });

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const node = getSelectedNode(selection);
			const parent = node.getParent();
			const isLink = $isLinkNode(parent) || $isLinkNode(node);

			setLinkUrl(isLink ? parent?.getURL?.() ?? node?.getURL?.() : null);
			setToolbarState((state) => ({
				...state,
				isBold: selection.hasFormat("bold"),
				isItalic: selection.hasFormat("italic"),
				isStrikethrough: selection.hasFormat("strikethrough"),
				isLink,
				isHeading1: $isHeadingNode(element) && element.getTag() === "h1",
				isHeading2: $isHeadingNode(element) && element.getTag() === "h2",
				isQuote: $isQuoteNode(element),
				isCode: selection.hasFormat("code"),
				isBulletList:
					$isListNode(element) &&
					$getNearestNodeOfType<ListNode>(element, ListNode)?.getListType() ===
						"bullet",
				isNumberList:
					$isListNode(element) &&
					$getNearestNodeOfType<ListNode>(element, ListNode)?.getListType() ===
						"number",
			}));
		}
	}, []);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					setToolbarState((state) => ({
						...state,
						canUndo: payload,
					}));
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					setToolbarState((state) => ({
						...state,
						canRedo: payload,
					}));
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [editor, updateToolbar]);

	function formatHeading(headingSize: HeadingTagType) {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createHeadingNode(headingSize));
			}
		});
	}

	function formatParagraph() {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
			}
		});
	}

	function formatQuote() {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createQuoteNode());
			}
		});
	}

	function formatList(type: ListType) {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				insertList(editor, type);
			}
		});
	}

	function formatLink(url: string | null) {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				toggleLink(url);
			}
		});
	}

	return (
		<div className="flex flex-nowrap bg-gray-100 rounded-md p-1.5 overflow-y-scroll space-x-1">
			<LinkPopover
				open={isEditingLink}
				onOpenChange={setIsEditingLink}
				linkUrl={linkUrl}
				onLinkUrlChange={setLinkUrl}
				onSave={formatLink}
			/>
			<ToolbarButton
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
				isActive={toolbarState.isBold}
				icon={Bold}
			/>
			<ToolbarButton
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
				isActive={toolbarState.isItalic}
				icon={Italic}
			/>
			<ToolbarButton
				onClick={() =>
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
				}
				isActive={toolbarState.isStrikethrough}
				icon={Strikethrough}
			/>
			<ToolbarButton
				onClick={() => {
					setIsEditingLink((value) => !value);
				}}
				isActive={toolbarState.isLink}
				icon={Link}
			/>
			<ToolbarButton
				onClick={() =>
					toolbarState.isHeading1 ? formatParagraph() : formatHeading("h1")
				}
				isActive={toolbarState.isHeading1}
				icon={Heading1}
			/>
			<ToolbarButton
				onClick={() =>
					toolbarState.isHeading2 ? formatParagraph() : formatHeading("h2")
				}
				isActive={toolbarState.isHeading2}
				icon={Heading2}
			/>
			<ToolbarButton
				onClick={() =>
					toolbarState.isQuote ? formatParagraph() : formatQuote()
				}
				isActive={toolbarState.isQuote}
				icon={Quote}
			/>
			<ToolbarButton
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
				isActive={toolbarState.isCode}
				icon={Code}
			/>
			<ToolbarButton
				onClick={() =>
					toolbarState.isBulletList ? formatParagraph() : formatList("bullet")
				}
				isActive={toolbarState.isBulletList}
				icon={List}
			/>
			<ToolbarButton
				onClick={() =>
					toolbarState.isNumberList ? formatParagraph() : formatList("number")
				}
				isActive={toolbarState.isNumberList}
				icon={ListOrdered}
			/>
			<ToolbarButton
				onClick={() =>
					editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
				}
				icon={Indent}
			/>
			<ToolbarButton
				onClick={() =>
					editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
				}
				icon={Outdent}
			/>
			<div className="flex-1" />
			<div className="flex">
				<ToolbarButton
					onClick={(e) => {
						editor.dispatchCommand(UNDO_COMMAND, undefined);
					}}
					disabled={!toolbarState.canUndo}
					icon={Undo}
				/>
				<ToolbarButton
					onClick={() => {
						editor.dispatchCommand(REDO_COMMAND, undefined);
					}}
					disabled={!toolbarState.canRedo}
					icon={Redo}
				/>
			</div>
		</div>
	);
}

type ToolbarButton = {
	isActive?: boolean;
	disabled?: boolean;
	icon: LucideIcon;
	onClick?: MouseEventHandler<HTMLButtonElement>;
};

function ToolbarButton({
	isActive,
	disabled,
	onClick,
	icon: Icon,
}: ToolbarButton) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				`p-1.5 rounded-md`,
				isActive && `bg-gray-200`,
				disabled && `opacity-20`
			)}
		>
			<Icon size={16} />
		</button>
	);
}

type LinkPopover = {
	linkUrl: string | null;
	open: boolean;
	onLinkUrlChange: (value: string) => void;
	onOpenChange: (value: boolean) => void;
	onSave: (value: string | null) => void;
};

function LinkPopover({
	linkUrl,
	onLinkUrlChange,
	open,
	onOpenChange,
	onSave,
}: LinkPopover) {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverAnchor>
				<div className="absolute top-0 left-0" />
			</PopoverAnchor>
			<PopoverContent align="start" className="w-[22rem] md:w-[32rem]">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSave(linkUrl);
						onOpenChange(false);
					}}
					className="flex space-x-2"
				>
					<Input
						autoFocus
						value={linkUrl ?? "https://"}
						onChange={(e) => {
							onLinkUrlChange(e.target.value);
						}}
					/>
					<div className="flex items-center">
						<Button type="submit" variant="ghost" size="sm" className="p-1">
							Link
						</Button>
						<Button
							onClick={() => {
								onSave(null);
								onOpenChange(false);
							}}
							variant="ghost"
							size="sm"
							className="p-1"
						>
							Unlink
						</Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	);
}

export function getSelectedNode(
	selection: RangeSelection
): TextNode | ElementNode {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
	}
}
