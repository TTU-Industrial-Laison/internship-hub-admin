"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asterisk, Sparkles, Edit, X } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { ZonePropertiesPanelProps } from "@/types/api/map";
import { ZoneFormData, zoneSchema } from "@/lib/validations/forms/map";
import { Separator } from "@/components/ui/separator";

export function ZonePropertiesPanel({
  onSubmit,
  onDelete,
  onClose,
  initialData,
  isEditing = false,
  onValuesChange,
}: Readonly<ZonePropertiesPanelProps>) {
  const form = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: "",
      color: "#60a5fa",
      transparency: 0.25,
      borderWidth: 2,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? "",
        color: initialData.color ?? "#60a5fa",
        transparency: initialData.transparency ?? 0.5,
        borderWidth: initialData.borderWidth ?? 2,
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!onValuesChange) return;
    const subscription = form.watch((value) => {
      onValuesChange(value as ZoneFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onValuesChange]);

  return (
    <Card className="absolute font-bai-jamjuree p-3 top-30 right-30 z-10 w-80 bg-white/95 backdrop-blur-sm border-gray-400 shadow-lg overflow-hidden flex flex-col max-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm">
          {isEditing ? (
            <>
              <Edit className="size-4 text-primary" />
              Edit Zone
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-primary" />
              New Zone
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onClose}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <form
          id="zone-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="zone-name"
                    className="flex items-center gap-1 text-xs"
                  >
                    Zone Name <Asterisk className="size-2.5 text-destructive" />
                  </FieldLabel>
                  <Input
                    {...field}
                    id="zone-name"
                    placeholder="e.g. Activity Center"
                    aria-invalid={fieldState.invalid}
                    className="h-9 text-sm border-slate-300"
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
                  <FieldLabel className="uppercase text-[10px] text-slate-500 font-bold mb-1.5">
                    Color
                  </FieldLabel>
                  <div className="space-y-2">
                    <TooltipProvider>
                      <div className="grid grid-cols-6 gap-1.5">
                        {PRESET_COLORS.map((color) => (
                          <Tooltip key={color.value}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => field.onChange(color.value)}
                                className={cn(
                                  "size-6 rounded-md transition-all duration-200 hover:scale-110",
                                  field.value === color.value
                                    ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-sm"
                                    : "hover:ring-1 hover:ring-slate-300"
                                )}
                                style={{ background: color.value }}
                              />
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

                    <div className="flex mt-4 items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-full">
                      <Input
                        type="color"
                        className="size-4 p-0 border-none bg-transparent cursor-pointer w-full h-5"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <span className="text-[10px] font-bold text-slate-500">
                        {field.value.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Separator />

            {/* Opacity & Border */}
            <div className="space-y-4">
              <Controller
                control={form.control}
                name="transparency"
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-[10px] uppercase font-bold text-slate-500">
                        Opacity
                      </FieldLabel>
                      <span className="text-[10px] bg-slate-100 px-1.5 rounded">
                        {Math.round(field.value * 100)}%
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                      className="py-1"
                    />
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="borderWidth"
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-[10px] uppercase font-bold text-slate-500">
                        Border Width
                      </FieldLabel>
                      <span className="text-[10px] bg-slate-100 px-1.5 rounded">
                        {field.value}px
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                      className="py-1"
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </div>

      {/* Footer */}
      <div className="p-2 border-t flex items-center gap-2">
        {onDelete && isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 ml-auto"
          >
            Delete
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 h-8 px-3 ml-auto"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          form="zone-form"
          size="sm"
          className="h-8 text-xs font-semibold px-4"
        >
          {isEditing ? "Save Changes" : "Create Zone"}
        </Button>
      </div>
    </Card>
  );
}
