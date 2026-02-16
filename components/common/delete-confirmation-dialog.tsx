"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirmationDialogProps } from "@/types/common/dialog";


export function DeleteConfirmationDialog({
  data,
  children,
  onCloseDialog,
  onDelete,
  isDeleting = false,
  isSuccess = false,
  title,
  description,
}: Readonly<DeleteConfirmationDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);

  // Close dialog when delete is successful
  useEffect(() => {
    if (isSuccess && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        onCloseDialog?.();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, isOpen, onCloseDialog]);

  function handleDelete() {
    onDelete?.(data.id);
  }

  const dialogTitle = title ?? (
    <>
      Remove <span className="text-destructive">“{data.name}”</span>?
    </>
  );

  const dialogDescription = description ?? (
    <>
      This action is{" "}
      <span className="font-semibold text-destructive">permanent</span> and
      cannot be undone. Are you sure you want to proceed?
    </>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isDeleting) return;
        setIsOpen(open);
        if (!open) onCloseDialog?.();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => {
          if (isDeleting) e.preventDefault();
        }}
      >
        <DialogHeader className="pt-4 flex flex-col items-center">
          <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
            <OctagonAlert
              className="h-8 w-8 text-destructive"
              strokeWidth={2.5}
            />
          </div>

          <DialogTitle className="text-center text-xl font-semibold tracking-tight text-slate-900 px-6">
            {dialogTitle}
          </DialogTitle>

          <DialogDescription className="text-base font-medium text-center text-gray-600 mt-2 px-6">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-4 w-full sm:flex-row flex-col px-2">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-full border border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-full font-semibold transition-all hover:scale-[1.02]"
          >
            {isDeleting ? (
              <>
                <Loader
                  className="h-4 w-4 animate-spin mr-2"
                  strokeWidth={2.5}
                />
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
