"use client";

import {
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Calendar as CalendarIcon, Loader, Asterisk } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  internshipPeriodInputSchema,
  InternshipPeriodInputValues,
} from "@/lib/validations/forms/internship-period";
import { InternshipPeriod } from "@/types/api/internship-period";
import { useMutateInternshipPeriod } from "@/lib/hooks/mutations/use-internship-mutations";
import { MultiSelect } from "@/components/common/multi-select";
import {
  CATEGORY_OPTIONS,
  INTERNSHIP_STATUS_OPTIONS,
} from "@/lib/constants/internship-period";

interface InternshipPeriodDialogProps {
  children: ReactNode;
  event?: InternshipPeriod;
  onCloseDialog?: () => void;
}

export const InternshipPeriodDialog = ({
  children,
  event,
  onCloseDialog,
}: InternshipPeriodDialogProps) => {
  const [resetKey, setResetKey] = useState(0);
  const [open, setOpen] = useState(false);
  const mutatePeriod = useMutateInternshipPeriod();
  const categoriesInteractedRef = useRef(false);

  const isEditMode = !!event;
  const isProcessing = mutatePeriod.isPending;

  const getFormValues = useCallback(() => {
    if (!isEditMode || !event) {
      return {
        name: "",
        startDate: undefined,
        endDate: undefined,
        eligibleCategories: [],
        status: "ONGOING" as const,
      };
    }

    return {
      name: event.name,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      eligibleCategories: event.eligibleCategories,
      status: event.status,
    };
  }, [isEditMode, event]);

  const { control, handleSubmit, reset, trigger, watch, clearErrors } =
    useForm<InternshipPeriodInputValues>({
      resolver: zodResolver(internshipPeriodInputSchema),
      mode: "all",
      reValidateMode: "onBlur",
      defaultValues: getFormValues(),
    });

  // Populate form when editing or opening
  useEffect(() => {
    if (open) {
      reset(getFormValues());
      setResetKey((prev) => prev + 1);
    }
  }, [getFormValues, open, reset]);

  const handleResetForm = () => {
    categoriesInteractedRef.current = false;
    clearErrors();
    reset(getFormValues());
    setResetKey((prev) => prev + 1);
  };

  const handleClose = () => {
    setOpen(false);
    if (onCloseDialog) onCloseDialog();
  };

  const onSubmit = async (data: InternshipPeriodInputValues) => {
    mutatePeriod.mutate(
      { id: event?.id, data },
      {
        onSuccess: () => {
          reset();
          setResetKey((prev) => prev + 1);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isProcessing) return;
        setOpen(isOpen);
        if (!isOpen && onCloseDialog) onCloseDialog();
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <DialogTitle>
              {isEditMode ? "Edit Internship Period" : "Add Internship Period"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the internship period details below."
                : "Create a new internship period for students."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form
          id="internship-period-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-2"
        >
          <FieldGroup>
            {/* Period Name */}
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="name"
                    className="flex items-center gap-1"
                  >
                    Period Name
                    <Asterisk size={12} className="text-destructive" />
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    disabled={isProcessing}
                    placeholder="e.g. Summer Internship"
                    aria-invalid={fieldState.invalid}
                    className="h-11 text-base! rounded-xl border border-gray-400"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-1">
                      Start Date
                      <Asterisk size={12} className="text-destructive" />
                    </FieldLabel>
                    <Popover key={`start-date-${resetKey}`}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full h-11 hover:bg-transparent justify-start text-left font-normal rounded-xl border border-gray-400",
                            !field.value && "text-muted-foreground",
                            fieldState.invalid && "border-destructive"
                          )}
                          disabled={isProcessing}
                        >
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                          {field.value && field.value instanceof Date ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={async (date) => {
                            field.onChange(date);
                            field.onBlur();
                            // Trigger validation for both dates
                            await trigger(["startDate", "endDate"]);
                          }}
                          disabled={isProcessing}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-1">
                      End Date
                      <Asterisk size={12} className="text-destructive" />
                    </FieldLabel>
                    <Popover key={`end-date-${resetKey}`}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full h-11 hover:bg-transparent justify-start text-left font-normal rounded-xl border border-gray-400",
                            !field.value && "text-muted-foreground",
                            fieldState.invalid && "border-destructive"
                          )}
                          disabled={isProcessing}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {field.value && field.value instanceof Date ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            field.onBlur();
                            // Trigger validation for both dates after state update
                            setTimeout(() => {
                              trigger(["startDate", "endDate"]);
                            }, 0);
                          }}
                          disabled={(date) => {
                            const startDate = watch("startDate");
                            return (
                              isProcessing ||
                              !!(
                                startDate &&
                                startDate instanceof Date &&
                                date < startDate
                              )
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Eligible Categories */}
            <Controller
              control={control}
              name="eligibleCategories"
              render={({ field, fieldState }) => {
                const handleBlur = () => {
                  // Only trigger validation if the field was actually interacted with
                  if (categoriesInteractedRef.current) {
                    field.onBlur();
                  }
                };

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="flex items-center gap-1">
                      Eligible Categories
                      <Asterisk size={12} className="text-destructive" />
                    </FieldLabel>
                    <div
                      onClick={() => {
                        categoriesInteractedRef.current = true;
                      }}
                    >
                      <MultiSelect
                        value={(field.value ?? []).map(String)}
                        onChange={(value) => {
                          categoriesInteractedRef.current = true;
                          field.onChange(value);
                          // Trigger validation after value changes
                          setTimeout(() => {
                            field.onBlur();
                          }, 0);
                        }}
                        onBlur={handleBlur}
                        options={CATEGORY_OPTIONS}
                        placeholder="Select eligible categories"
                        searchPlaceholder="Search categories..."
                        disabled={isProcessing}
                        hasError={fieldState.invalid}
                        className="h-11"
                      />
                    </div>
                    {fieldState.invalid && fieldState.isTouched && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Status */}
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="flex items-center gap-1">
                    Status
                    <Asterisk size={12} className="text-destructive" />
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <SelectTrigger className="h-11! text-base! rounded-xl border border-gray-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERNSHIP_STATUS_OPTIONS.map((option) => (
                        <Fragment key={option.value}>
                          <SelectItem
                            value={option.value}
                            className="text-base!"
                          >
                            {option.label}
                          </SelectItem>
                          <SelectSeparator className="last:hidden"/>
                        </Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter className="flex gap-4 sm:gap-x-12 px-2 pb-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11 font-medium rounded-full border border-gray-300"
            onClick={handleResetForm}
            disabled={isProcessing}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            form="internship-period-form"
            className="flex-1 h-11 rounded-full font-medium shadow-lg shadow-indigo-500/25"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader
                  className="h-4 w-4 animate-spin"
                  strokeWidth={2.5}
                />
                {isEditMode ? "Updating" : "Saving"}
              </>
            ) : (
              <>{isEditMode ? "Update Period" : "Save Period"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
