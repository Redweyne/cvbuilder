import * as React from "react";
import { cn } from "@/lib/utils";

let dialogOpenCount = 0;

const updateDialogState = (isOpening) => {
  if (isOpening) {
    dialogOpenCount++;
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('data-dialog-open', 'true');
  } else {
    dialogOpenCount = Math.max(0, dialogOpenCount - 1);
    if (dialogOpenCount === 0) {
      document.body.style.overflow = '';
      document.body.removeAttribute('data-dialog-open');
    }
  }
};

export const isDialogOpen = () => dialogOpenCount > 0;

const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
});

const Dialog = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext);
  
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onOpenChange(true);
    props.onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
    });
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext);
  const wasOpenRef = React.useRef(false);
  
  React.useEffect(() => {
    if (open && !wasOpenRef.current) {
      updateDialogState(true);
      wasOpenRef.current = true;
    } else if (!open && wasOpenRef.current) {
      updateDialogState(false);
      wasOpenRef.current = false;
    }
    
    return () => {
      if (wasOpenRef.current) {
        updateDialogState(false);
        wasOpenRef.current = false;
      }
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onOpenChange(false);
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        ref={ref}
        onClick={handleContentClick}
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg",
          className
        )}
        {...props}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onOpenChange(false); }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
