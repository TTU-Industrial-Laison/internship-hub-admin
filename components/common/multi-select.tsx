"use client";

import { Fragment, useState, useRef, useEffect, useMemo } from "react";
import { X, Search, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MultiSelectProps } from "@/types/api/internship-period";



export const MultiSelect = ({
  value = [],
  onChange,
  onBlur,
  options = [],
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  hasError = false,
  maxSelections = 99,
  disabled = false,
  className,
}: MultiSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        opt.value.toLowerCase().includes(term) ||
        opt.description?.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const selectedOptions = useMemo(() => {
    const selectedValues = new Set(value);
    return options.filter((opt) => selectedValues.has(opt.value));
  }, [options, value]);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((val) => val !== optionValue));
    } else if (value.length < maxSelections) {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((val) => val !== optionValue));
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      } else {
        onBlur?.();
      }
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} items selected`;
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "w-full h-10 justify-between text-left border font-normal border-gray-400 hover:bg-transparent",
          hasError && "border-destructive",
          disabled && "cursor-not-allowed opacity-50",
          selectedOptions.length === 0 && "text-muted-foreground",
          className
        )}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform opacity-50",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-50 mt-1 bg-white border border-gray-400 rounded-md shadow-lg overflow-hidden">
            <div className="p-2 border-b bg-slate-50/50">
              <div className="relative">
                <Search className="absolute h-4 w-4 opacity-50 top-2.5 left-3" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  className="pl-10 h-9 bg-white border-gray-400"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No items found
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option, index) => {
                const isSelected = value.includes(option.value);
                const isDisabled = !isSelected && value.length >= maxSelections;

                return (
                  <Fragment key={option.value}>
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "w-full justify-start hover:bg-gray-50 px-3 py-2.5 h-auto rounded-none font-normal",
                        isDisabled &&
                          "opacity-50 cursor-not-allowed hover:bg-transparent",
                        isSelected && "bg-slate-100 hover:bg-slate-100 my-px"
                      )}
                      onClick={() => !isDisabled && handleSelect(option.value)}
                      disabled={isDisabled}
                    >
                      <div className="flex flex-1 flex-col text-left">
                        <span className="font-medium text-sm text-slate-900">
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                      )}
                    </Button>
                    {index < filteredOptions.length - 1 && (
                      <Separator className="bg-slate-100" />
                    )}
                  </Fragment>
                );
              })}
            </div>

            {value.length >= maxSelections && (
              <div className="px-3 py-2 text-[10px] text-orange-600 bg-orange-50 border-t uppercase tracking-wider font-semibold">
                Maximum {maxSelections} selections reached
              </div>
            )}
          </div>
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border-none rounded-full"
            >
              <span className="truncate max-w-[150px]">{option.label}</span>
              {!disabled && (
                <button
                  type="button"
                  className="rounded-full hover:bg-slate-300 p-0.5 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
