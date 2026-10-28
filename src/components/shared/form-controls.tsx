"use client";

/**
 * Site-styled wrappers around shadcn/ui primitives.
 * Use these instead of native <select>, custom checkboxes etc.
 * Field box: 40px (mobile/tablet) / 46px (desktop), #2a2a2a border, radius 8, black fill.
 */
import { useId } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const fieldBox =
  "h-[40px] w-full rounded-[8px] border border-bd-card-border bg-bd-page px-[14px] text-[13px] text-bd-muted shadow-none transition-[border-color,box-shadow] hover:border-bd-placeholder focus-visible:border-bd-royal focus-visible:ring-[3px] focus-visible:ring-bd-royal/15 data-[placeholder]:text-bd-muted xl:h-[46px] xl:px-[16px] xl:text-[14px]";
export const fieldLabel = "text-[13px] font-normal leading-[1.21] text-bd-text xl:text-[14px]";

export function Field({ label, htmlFor, error, className, children }: { label?: string; htmlFor?: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-[9px] lg:gap-[7px] xl:gap-[11px]", className)}>
      {label && (
        <Label htmlFor={htmlFor} className={fieldLabel}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-[12px] text-bd-red xl:text-[13px]">
          {error}
        </motion.p>
      )}
    </div>
  );
}

/** shadcn <Input> in the dashboard field style. */
export function TextInput({ className, invalid, ...props }: React.ComponentProps<typeof Input> & { invalid?: boolean }) {
  return (
    <Input
      aria-invalid={invalid || undefined}
      className={cn(fieldBox, "text-bd-primary placeholder:text-bd-placeholder md:text-[13px] xl:md:text-[14px]", invalid && "border-bd-red", className)}
      {...props}
    />
  );
}

export interface Option {
  value: string;
  label: string;
}

/** shadcn <Select> in the dashboard field style. */
export function SelectField({
  value,
  onValueChange,
  options,
  placeholder = "Select",
  className,
  id,
  invalid,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  id?: string;
  invalid?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(fieldBox, "justify-between data-[size=default]:h-[40px] xl:data-[size=default]:h-[46px] [&_svg]:text-bd-muted [&_svg]:opacity-100", invalid && "border-bd-red", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-[8px] border-bd-card-border">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="rounded-[6px] text-[13px] text-bd-primary focus:bg-bd-input focus:text-bd-royal xl:text-[14px]">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** shadcn Checkbox with label, dashboard colours. */
export function CheckboxField({ checked, onCheckedChange, children, className }: { checked: boolean; onCheckedChange: (v: boolean) => void; children: React.ReactNode; className?: string }) {
  const id = useId();
  return (
    <div className={cn("flex items-center gap-[10px]", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="size-[18px] rounded-[4px] border-bd-card-border data-[state=checked]:border-bd-royal data-[state=checked]:bg-bd-royal"
      />
      <Label htmlFor={id} className="cursor-pointer text-[13px] font-normal text-bd-text xl:text-[15px]">
        {children}
      </Label>
    </div>
  );
}
