"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useApp, type User } from "@/lib/store";
import { SelectField, type Option } from "@/components/shared/form-controls";
import { ControlField, SaveButton, SubHeading, TextField } from "./fields";

const COUNTRIES: Option[] = [
  "USA",
  "India",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Japan",
  "Singapore",
  "UAE",
  "Brazil",
  "South Africa",
].map((c) => ({ value: c, label: c }));

type Errors = Partial<Record<"name" | "username" | "email" | "phone", string>>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Read an image file and downscale it (≤256px, JPEG) to a small data URL for localStorage. */
function fileToAvatar(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function ProfilePhoto({ src, name, onPick }: { src: string; name: string; onPick: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-[12px] lg:items-start">
      <div className="relative size-[120px] shrink-0 xl:size-[132px]">
        <motion.div
          key={src}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="size-full overflow-hidden rounded-full border border-bd-card-border"
        >
          <Image src={src} alt={name} width={132} height={132} className="size-full object-cover" unoptimized={src.startsWith("data:")} priority />
        </motion.div>
        <motion.button
          type="button"
          aria-label="Change profile photo"
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="absolute right-[2px] bottom-[6px] flex size-[32px] items-center justify-center rounded-full border-2 border-bd-surface bg-bd-royal text-white"
        >
          <Pencil className="size-[14px]" />
        </motion.button>
        {/* hidden file picker (not a visible form control) */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="Profile photo file"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (!f.type.startsWith("image/")) return toast.error("Please choose an image file");
            try {
              onPick(await fileToAvatar(f));
              toast.info("Photo ready — click Save to apply it");
            } catch {
              toast.error("Couldn't read that image");
            }
          }}
        />
      </div>
      <p className="text-center text-[12px] text-bd-muted lg:text-left">JPG or PNG, square works best.</p>
    </div>
  );
}

export function EditProfileForm() {
  const user = useApp((s) => s.user);
  const updateUser = useApp((s) => s.updateUser);
  const notify = useApp((s) => s.notify);

  const [p, setP] = useState<User>(user);
  const [errors, setErrors] = useState<Errors>({});

  // Pick up the persisted profile once the store rehydrates (and after saves).
  useEffect(() => setP(user), [user]);

  const set =
    <K extends keyof User>(k: K) =>
    (v: User[K]) => {
      setP((s) => ({ ...s, [k]: v }));
      if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
    };

  const validate = () => {
    const n: Errors = {};
    if (p.name.trim().length < 2) n.name = "Enter your name";
    if (!/^[a-z0-9._-]{2,}$/i.test(p.username.trim())) n.username = "Letters, numbers, dots, dashes or underscores";
    if (!isEmail(p.email)) n.email = "Enter a valid email address";
    if (p.phone && !/^[+()\d\s-]{7,20}$/.test(p.phone.trim())) n.phone = "Enter a valid phone number";
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const save = () => {
    updateUser({ ...p, name: p.name.trim(), username: p.username.trim(), email: p.email.trim(), phone: p.phone.trim() });
    notify({ title: "Profile updated", body: "Your personal details were saved", kind: "info", href: "/dashboard/settings" });
    toast.success("Profile saved");
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      noValidate
      className="mt-[24px] flex flex-col gap-[24px] lg:grid lg:grid-cols-[140px_minmax(0,1fr)] lg:gap-x-[40px] xl:mt-[32px] xl:grid-cols-[150px_minmax(0,1fr)] xl:gap-x-[52px]"
    >
      <ProfilePhoto src={p.avatar} name={p.name} onPick={set("avatar")} />
      <div className="flex min-w-0 flex-col gap-[24px]">
        <SubHeading description="How you appear to your team and in incident timelines.">Personal details</SubHeading>
        <div className="grid gap-[16px] md:grid-cols-2 md:gap-x-[22px] xl:gap-y-[20px]">
          <TextField label="Full name" value={p.name} onChange={set("name")} autoComplete="name" error={errors.name} />
          <TextField label="Username" value={p.username} onChange={set("username")} autoComplete="username" error={errors.username} />
          <TextField label="Work email" type="email" value={p.email} onChange={set("email")} autoComplete="email" error={errors.email} />
          <TextField label="Phone" type="tel" value={p.phone} onChange={set("phone")} autoComplete="tel" error={errors.phone} />
          <TextField label="Job title" value={p.jobTitle} onChange={set("jobTitle")} autoComplete="organization-title" />
          <TextField label="Company" value={p.company} onChange={set("company")} autoComplete="organization" />
          <TextField label="City" value={p.city} onChange={set("city")} autoComplete="address-level2" />
          <ControlField label="Country" htmlFor="profile-country">
            <SelectField
              id="profile-country"
              value={p.country}
              onValueChange={set("country")}
              options={p.country && !COUNTRIES.some((c) => c.value === p.country) ? [{ value: p.country, label: p.country }, ...COUNTRIES] : COUNTRIES}
              placeholder="Select country"
            />
          </ControlField>
        </div>
        <SaveButton onValidate={validate} onSave={save} />
      </div>
    </form>
  );
}
