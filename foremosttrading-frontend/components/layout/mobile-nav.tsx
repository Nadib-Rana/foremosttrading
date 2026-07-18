import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { navLinks } from "@/components/layout/Navbar";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

export interface MobileNavProps {
	isLight?: boolean;
}

export function MobileNav({ isLight }: MobileNavProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className={cn(
					"md:hidden",
					isLight
						? "text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
						: "text-white border-white/20 hover:bg-white/10 hover:text-white"
				)}
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-4.5" />
				) : (
					<MenuIcon className="size-4.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4 font-sans"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{navLinks.map((link) => (
								<Button
									className="justify-start text-white hover:text-primary hover:bg-white/10"
									key={link.label}
									variant="ghost"
									render={<Link href={link.href} />}
									onClick={() => setOpen(false)}
									nativeButton={false}
								>
									{link.label}
								</Button>
							))}
						</div>
						<div className="mt-12 flex flex-col gap-2">
							<Button
								className="w-full border-white/20 text-white hover:bg-white/10"
								variant="outline"
								render={<Link href="/login" />}
								onClick={() => setOpen(false)}
								nativeButton={false}
							>
								Sign In
							</Button>
							<Button
								className="w-full bg-primary text-white hover:bg-primary/80"
								render={<Link href="/signup" />}
								onClick={() => setOpen(false)}
								nativeButton={false}
							>
								Get Started
							</Button>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
