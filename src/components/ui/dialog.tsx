// src/components/ui/dialog.tsx

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "../../lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { X } from "lucide-react"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black bg-opacity-50 z-50", className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { size?: "sm" | "md" | "lg"; animatedAnswer?: string }
>(({ className, children, size = "md", animatedAnswer, ...props }, ref) => {
  const [position, setPosition] = React.useState({ top: "50%", left: "50%" })
  const [dragging, setDragging] = React.useState(false)
  const [displayedAnswer, setDisplayedAnswer] = React.useState("")

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) {
      const { clientX, clientY } = e
      setPosition({ top: `${clientY}px`, left: `${clientX}px` })
    }
  }

  // Use _e to avoid TS6133 unused variable error
  const onPointerDown = (_e: React.PointerEvent) => {
    setDragging(true)
  }

  const onPointerUp = () => {
    setDragging(false)
  }

  React.useEffect(() => {
    if (animatedAnswer) {
      setDisplayedAnswer(animatedAnswer)
    }
  }, [animatedAnswer])

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 max-h-[85vh] w-full overflow-auto rounded-2xl bg-neutral-900 shadow-2xl focus:outline-none border border-neutral-700",
          sizeClasses[size],
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
        }}
        {...props}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Draggable header */}
        <div
          className="flex items-center justify-between cursor-move select-none mb-4 p-2 rounded-t-2xl bg-neutral-800 border-b border-neutral-700"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
        >
          <span className="font-semibold text-lg text-white tracking-wide">AI Assistant</span>
          <DialogPrimitive.Close asChild>
            <button
              className="rounded-full p-1 hover:bg-neutral-700 transition-colors text-neutral-300 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogPrimitive.Close>
        </div>
        <div className="text-white text-base leading-relaxed space-y-4">
          {animatedAnswer ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-2" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-yellow-300" {...props} />,
                code: ({node, ...props}) => <code className="bg-neutral-800 px-1 py-0.5 rounded text-yellow-200" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-yellow-200 my-2" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-400 underline" {...props} />,
              }}
            >
              {displayedAnswer}
            </ReactMarkdown>
          ) : (
            children
          )}
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogClose = DialogPrimitive.Close

export { Dialog, DialogTrigger, DialogContent, DialogClose }
