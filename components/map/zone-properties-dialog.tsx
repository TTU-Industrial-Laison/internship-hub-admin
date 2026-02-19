"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, Sparkles, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PRESET_COLORS } from "@/lib/constants/map";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ZonePropertiesDialogProps } from "@/types/api/map";
import { ZoneFormData, zoneSchema } from "@/lib/validations/forms/map";

export function ZonePropertiesDialog({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  initialData,
  isEditing = false,
}: Readonly<ZonePropertiesDialogProps>) {
  const form = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: "",
      color: "#60a5fa",
      transparency: 0.5,
      borderWidth: 2,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name ?? "",
        color: initialData?.color ?? "#60a5fa",
        transparency: initialData?.transparency ?? 0.5,
        borderWidth: initialData?.borderWidth ?? 2,
      });
    }
  }, [open, initialData, form]);

  const watchedColor = form.watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Preview Section */}
          <div
            className="w-full md:w-56 p-6 flex flex-col items-center justify-center relative overflow-hidden shrink-0"
            style={{
              background: `${watchedColor}20`,
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: watchedColor }}
            />

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 relative z-10">
              Preview
            </p>

            <div className="relative z-10 w-32 h-32 flex items-center justify-center">
              <div
                className="w-full h-full rounded-2xl shadow-xl transition-all duration-300 border-2"
                style={{
                  background: watchedColor,
                  opacity: form.watch("transparency"),
                  borderWidth: `${form.watch("borderWidth")}px`,
                  borderColor: watchedColor,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="size-8 text-white/80 drop-shadow-lg" />
              </div>
            </div>

            <div className="mt-6 text-center relative z-10 px-4">
              <p className="text-sm font-bold text-slate-800 truncate w-full">
                {form.watch("name") || "New Zone"}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Zone Preview</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 p-6 bg-white overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                {isEditing ? (
                  <>
                    <Edit className="size-5 text-primary" />
                    Edit Zone
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 text-primary" />
                    Zone Properties
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                Configure the visual style and name for this zone.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                {/* Name */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="zone-name"
                        className="flex items-center gap-1"
                      >
                        Zone Name{" "}
                        <Asterisk className="size-3 text-destructive" />
                      </FieldLabel>
                      <Input
                        {...field}
                        id="zone-name"
                        placeholder="e.g. Accra Central"
                        aria-invalid={fieldState.invalid}
                        className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 bg-slate-50/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Color */}
                <Controller
                  control={form.control}
                  name="color"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="uppercase text-xs">
                        Zone Color
                      </FieldLabel>
                      <div className="space-y-3">
                        <TooltipProvider>
                          <div className="grid grid-cols-8 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {PRESET_COLORS.map((color) => (
                              <Tooltip key={color.value}>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => field.onChange(color.value)}
                                    className={cn(
                                      "size-7 rounded-lg transition-all duration-200 hover:scale-110",
                                      field.value === color.value
                                        ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-lg"
                                        : "hover:ring-2 hover:ring-slate-300",
                                    )}
                                    style={{ background: color.value }}
                                  >
                                    {field.value === color.value && (
                                      <div className="size-full flex items-center justify-center">
                                        <div className="size-1.5 bg-white rounded-full shadow-sm" />
                                      </div>
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-[10px] font-bold">
                                    {color.name}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </TooltipProvider>

                        <div className="flex items-center gap-3 px-1">
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
                            <Input
                              type="color"
                              className="size-5 cursor-pointer rounded bg-transparent p-0 border-none w-16"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <span className="text-[10px] font-medium">
                              {field.value.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Opacity */}
                  <Controller
                    control={form.control}
                    name="transparency"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs uppercase">
                          Opacity ({Math.round(field.value * 100)}%)
                        </FieldLabel>
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          className="py-4"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* BorderWidth */}
                  <Controller
                    control={form.control}
                    name="borderWidth"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs uppercase">
                          Border ({field.value}px)
                        </FieldLabel>
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          className="py-4"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>

              <DialogFooter className="pt-4 border-t border-slate-100 mt-6 gap-2 flex-col sm:flex-row">
                {onDelete && isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive hover:bg-destructive/5 font-bold text-xs"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                )}
                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="flex-1 sm:flex-none font-semibold text-xs text-slate-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none font-semibold text-xs h-10 px-6"
                  >
                    {isEditing ? "Update Zone" : "Create Zone"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
