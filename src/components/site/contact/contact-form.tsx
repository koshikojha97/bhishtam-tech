"use client";

/**
 * Contact form section (id="form"). shadcn Form + Input/Textarea/Select/Checkbox, zod validation via
 * react-hook-form. Submit → loading → animated success state (GSAP: card flip-in, check stroke draw) + toast.
 * Inputs follow the Figma "Input Text" spec (bg #0c0c0c, border #212121, r 8, min-h 48, 18px/1.32).
 */
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Clock, Loader2, ShieldCheck, Users } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { A, Container, PrimaryButton, SectionTag } from "../ui";
import { Reveal, SplitReveal } from "../anim";

const SERVICES = ["Network protection", "Data security", "Malware prevention", "Cloud security", "Other"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().min(1, "Please enter your email address.").email("Please enter a valid email address."),
  company: z.string().trim().max(80, "Company name is too long.").optional(),
  service: z.string().min(1, "Please choose a service."),
  message: z.string().trim().min(10, "Your message should be at least 10 characters.").max(1000, "Please keep it under 1000 characters."),
  consent: z.boolean().refine((v) => v, "Please accept the privacy policy to continue."),
});
type Values = z.infer<typeof schema>;

const field =
  "min-h-[48px] h-auto rounded-[8px] border-cx-line bg-cx-bg-2 px-[16px] py-[11px] font-geist text-[16px] leading-[1.32] text-white shadow-[0_1px_1.5px_rgba(25,33,61,0.1)] placeholder:text-cx-subtle md:text-[18px] dark:bg-cx-bg-2 focus-visible:border-cx-accent focus-visible:ring-[4px] focus-visible:ring-cx-accent/15 aria-invalid:border-red-500/70 aria-invalid:ring-0";
const label = "font-geist text-[16px] leading-[1.25] font-medium text-white data-[error=true]:text-white";
const msg = "font-geist text-[14px] text-red-400";

const PERKS = [
  { icon: Clock, title: "Fast response", text: "Lorem ipsum dolor sit amet consectetur. Reply within 24 hours." },
  { icon: ShieldCheck, title: "Confidential", text: "Lacus id turpis ut nulla dui proin nunc dui tellus blandit." },
  { icon: Users, title: "Expert team", text: "Nisl commodo erat quam metus. Certified security engineers." },
];

export function ContactFormSection() {
  const scope = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", service: "", message: "", consent: false },
  });
  const { isSubmitting } = form.formState;
  const { contextSafe } = useGSAP({ scope });

  const animateSuccess = contextSafe(() => {
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => {
      const tl = gsap.timeline();
      tl.from("[data-success]", { rotateY: -18, y: 30, opacity: 0, transformPerspective: 1200, duration: 0.9, ease: "expo.out" })
        .from("[data-success-ring]", { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.8)" }, 0.1)
        .fromTo("[data-success-check]", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0.4)
        .from("[data-success-in]", { y: 16, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }, 0.45);
    });
  });

  const shakeInvalid = contextSafe(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[aria-invalid=true]", { x: 0 }, { keyframes: { x: [-8, 7, -5, 3, 0] }, duration: 0.45, ease: "none" });
  });

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 1400));
    setSent(v.name.split(" ")[0]);
    toast.success("Message sent", { description: "Thanks! Our team will get back to you within 24 hours." });
    form.reset();
    animateSuccess();
  };

  const onInvalid = () => {
    toast.error("Please check the form", { description: "Some fields need your attention." });
    requestAnimationFrame(shakeInvalid);
  };

  return (
    <section id="form" className="scroll-mt-[40px] py-[80px] md:py-[120px]">
      <Container>
        <div ref={scope} className="grid grid-cols-1 gap-[48px] xl:grid-cols-[470px_1fr] xl:gap-[80px]">
          {/* Left column */}
          <div className="flex flex-col">
            <Reveal>
              <SectionTag both={false}>Send a message</SectionTag>
            </Reveal>
            <div className="py-[16px]">
              <SplitReveal className="font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
                Let&apos;s <A>secure</A> your business together
              </SplitReveal>
            </div>
            <Reveal as="p" delay={0.1} className="font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
              Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit morbi.
            </Reveal>
            <Reveal stagger={0.1} className="grid grid-cols-1 gap-[24px] pt-[40px] sm:grid-cols-3 xl:grid-cols-1">
              {PERKS.map(({ icon: Icon, title, text }) => (
                <div key={title} data-reveal className="flex gap-[14px]">
                  <Icon className="mt-[2px] size-[20px] shrink-0 text-white" strokeWidth={1.8} />
                  <div>
                    <p className="font-geist text-[20px] leading-[1.25] font-medium text-white">{title}</p>
                    <p className="pt-[6px] font-geist text-[16px] leading-[1.5] text-cx-muted">{text}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Form card */}
          <Reveal y={50} className="relative">
            <div className="relative overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg-2 p-[20px] sm:p-[32px] md:p-[40px]">
              <span aria-hidden className="pointer-events-none absolute -top-[160px] -right-[160px] size-[360px] rounded-full bg-cx-accent/15 blur-[90px]" />
              {sent ? (
                <div data-success role="status" aria-live="polite" className="relative flex min-h-[560px] flex-col items-center justify-center text-center">
                  <span data-success-ring className="flex size-[88px] items-center justify-center rounded-full bg-cx-accent shadow-[0_0_60px_rgba(225,38,50,0.6)]">
                    <svg viewBox="0 0 24 24" className="size-[40px]" fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path data-success-check d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray={40} />
                    </svg>
                  </span>
                  <h3 data-success-in className="pt-[32px] font-geist text-[30px] leading-[1.25] font-medium text-white md:text-[36px]">
                    Thank you, <A>{sent}</A>!
                  </h3>
                  <p data-success-in className="max-w-[420px] pt-[12px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
                    Your message has been received. Lorem ipsum dolor sit amet consectetur — one of our experts will reach out within 24 hours.
                  </p>
                  <div data-success-in className="flex flex-wrap items-center justify-center gap-[12px] pt-[28px]">
                    <button
                      type="button"
                      onClick={() => setSent(null)}
                      className="rounded-[8px] border border-cx-line px-[20px] py-[11px] font-geist text-[16px] leading-[1.25] font-medium text-white transition-colors hover:border-cx-accent hover:bg-cx-accent md:text-[18px]"
                    >
                      Send another message
                    </button>
                    <PrimaryButton href="/">Back to home</PrimaryButton>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate className="relative grid grid-cols-1 gap-[20px] sm:grid-cols-2 md:gap-[24px]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className={label}>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Carter" autoComplete="name" className={field} {...f} />
                          </FormControl>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className={label}>Email address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" autoComplete="email" className={field} {...f} />
                          </FormControl>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className={label}>
                            Company <span className="font-normal text-cx-subtle">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" autoComplete="organization" className={field} {...f} />
                          </FormControl>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className={label}>Service</FormLabel>
                          <Select value={f.value} onValueChange={f.onChange}>
                            <FormControl>
                              <SelectTrigger
                                onBlur={f.onBlur}
                                className={`${field} w-full data-[placeholder]:text-cx-subtle data-[size=default]:h-auto [&_svg]:text-cx-subtle [&_svg]:opacity-100`}
                              >
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent position="popper" className="rounded-[8px] border-cx-line bg-cx-bg-2 p-[4px] font-geist text-white shadow-[0_24px_60px_-20px_rgba(225,38,50,0.35)]">
                              {SERVICES.map((s) => (
                                <SelectItem key={s} value={s} className="cursor-pointer rounded-[6px] px-[12px] py-[10px] text-[16px] text-cx-muted focus:bg-cx-line focus:text-white [&_svg]:text-cx-accent">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field: f }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className={label}>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us about your project and security needs…" rows={6} className={`${field} min-h-[160px] resize-y`} {...f} />
                          </FormControl>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field: f }) => (
                        <FormItem className="sm:col-span-2">
                          <div className="flex items-start gap-[12px]">
                            <FormControl>
                              <Checkbox
                                checked={f.value}
                                onCheckedChange={(c) => f.onChange(c === true)}
                                onBlur={f.onBlur}
                                className="mt-[2px] size-[20px] rounded-[4px] border-cx-line bg-cx-bg-2 data-[state=checked]:border-cx-accent data-[state=checked]:bg-cx-accent data-[state=checked]:text-white dark:bg-cx-bg-2 dark:data-[state=checked]:bg-cx-accent"
                              />
                            </FormControl>
                            <FormLabel className="font-geist text-[16px] leading-[1.5] font-normal text-cx-muted data-[error=true]:text-cx-muted">
                              I agree to the processing of my personal data in accordance with the privacy policy.
                            </FormLabel>
                          </div>
                          <FormMessage className={msg} />
                        </FormItem>
                      )}
                    />
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative inline-flex w-full items-center justify-center gap-[8px] overflow-hidden rounded-[8px] bg-white px-[24px] py-[12px] font-geist text-[18px] leading-[1.25] font-medium text-cx-bg transition-transform active:scale-[0.98] disabled:cursor-wait sm:w-auto"
                      >
                        <span className="absolute inset-0 origin-left scale-x-0 bg-cx-accent transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100 group-disabled:scale-x-100" />
                        <span className="relative flex items-center gap-[8px] transition-colors duration-300 group-hover:text-white group-disabled:text-white">
                          {isSubmitting && <Loader2 className="size-[18px] animate-spin" />}
                          {isSubmitting ? "Sending…" : "Send message"}
                        </span>
                      </button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
