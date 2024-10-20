import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Button, ButtonProps } from "./button"
import { cn } from "~/lib/utils"

interface ButtonWithTooltipProps extends ButtonProps {
    tooltipContent: React.ReactNode
    tooltipSide?: "top" | "right" | "bottom" | "left"
    tooltipAlign?: "start" | "center" | "end"
}

const ButtonWithTooltip = React.forwardRef<HTMLButtonElement, ButtonWithTooltipProps>(
    ({ className, children, tooltipContent, tooltipSide = "top", tooltipAlign = "center", ...props }, ref) => {
        return (
            <TooltipPrimitive.Provider>
                <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                        <Button className={className} ref={ref} {...props}>
                            {children}
                        </Button>
                    </TooltipPrimitive.Trigger>
                    <TooltipPrimitive.Portal>
                        <TooltipPrimitive.Content
                            className={cn(
                                "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                                className
                            )}
                            sideOffset={5}
                            side={tooltipSide}
                            align={tooltipAlign}
                        >
                            {tooltipContent}
                        </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
            </TooltipPrimitive.Provider>
        )
    }
)

ButtonWithTooltip.displayName = "ButtonWithTooltip"

export { ButtonWithTooltip }
