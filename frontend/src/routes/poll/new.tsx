import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../api/client";
import { PlusCircle, Trash2, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GlassCard, ShimmerButton } from "@/components/ui/aceternity";

/* -------------------------------------------------------------------------- */
/* Schema                                                                      */
/* -------------------------------------------------------------------------- */

const optionSchema = z.object({
  text: z.string().min(1, "Option text cannot be empty"),
});

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  mandatory: z.boolean(),
  options: z
    .array(optionSchema)
    .min(2, "Each question needs at least 2 options"),
});

const pollSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be under 255 characters"),
  description: z.string().optional(),
  isAnonymous: z.boolean(),
  expiresAt: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

type PollFormValues = z.infer<typeof pollSchema>;

/* -------------------------------------------------------------------------- */
/* Route                                                                       */
/* -------------------------------------------------------------------------- */

export const Route = createFileRoute("/poll/new")({ component: CreatePoll });

/* -------------------------------------------------------------------------- */
/* QuestionCard — nested field array for options lives here                   */
/* -------------------------------------------------------------------------- */

interface QuestionCardProps {
  form: UseFormReturn<PollFormValues>;
  qi: number;
  onRemove: () => void;
  canRemove: boolean;
}

function QuestionCard({ form, qi, onRemove, canRemove }: QuestionCardProps) {
  const { control } = form;

  const {
    fields: optFields,
    append: appendOpt,
    remove: removeOpt,
  } = useFieldArray({ control, name: `questions.${qi}.options` });

  const inputCls =
    "bg-background/50 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-xl";

  return (
    <GlassCard className="p-6 space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Q{qi + 1}
          </span>

          {/* mandatory toggle rendered through FormField so RHF tracks it */}
          <FormField
            control={control}
            name={`questions.${qi}.mandatory`}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors ${
                  field.value
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {field.value ? "Mandatory" : "Optional"}
              </button>
            )}
          />
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Question text ── */}
      <FormField
        control={control}
        name={`questions.${qi}.text`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="What do you want to ask?"
                className={`h-10 ${inputCls}`}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ── Options ── */}
      <div className="space-y-2 pl-4 border-l-2 border-primary/20">
        {optFields.map((optField, oi) => (
          <FormField
            key={optField.id}
            control={control}
            name={`questions.${qi}.options.${oi}.text`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 shrink-0" />
                  <FormControl>
                    <Input
                      placeholder={`Option ${oi + 1}`}
                      className={`h-9 text-sm ${inputCls}`}
                      {...field}
                    />
                  </FormControl>
                  {optFields.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOpt(oi)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Array-level error (min 2 options) */}
        {form.formState.errors.questions?.[qi]?.options?.message && (
          <p className="text-[12px] font-medium text-destructive">
            {form.formState.errors.questions[qi].options.message}
          </p>
        )}

        <button
          type="button"
          onClick={() => appendOpt({ text: "" })}
          className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs mt-1 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add option
        </button>
      </div>
    </GlassCard>
  );
}

/* -------------------------------------------------------------------------- */
/* CreatePoll                                                                  */
/* -------------------------------------------------------------------------- */

function CreatePoll() {
  const navigate = useNavigate();

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      isAnonymous: true,
      expiresAt: "",
      questions: [
        { text: "", mandatory: true, options: [{ text: "" }, { text: "" }] },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control: form.control, name: "questions" });

  /* ── Submit ── */
  const onSubmit = async (values: PollFormValues) => {
    try {
      const payload: Record<string, unknown> = {
        title: values.title,
        description: values.description,
        isAnonymous: values.isAnonymous,
      };
      if (values.expiresAt) {
        payload.expiresAt = new Date(values.expiresAt).toISOString();
      }

      const { data: pollData } = await apiClient.post("/polls", payload);
      const pollId = pollData.data.id;

      for (let i = 0; i < values.questions.length; i++) {
        const q = values.questions[i];
        const { data: qData } = await apiClient.post(
          `/polls/${pollId}/questions`,
          { text: q.text, order: i, isMandatory: q.mandatory },
        );
        const qId = qData.data.id;
        await Promise.all(
          q.options.map((opt, oi) =>
            apiClient.post(`/questions/${qId}/options`, {
              text: opt.text,
              order: oi,
            }),
          ),
        );
      }

      await apiClient.put(`/polls/${pollId}/publish`);
      navigate({ to: "/dashboard" });
    } catch {
      alert("Error creating poll");
    }
  };

  const inputCls =
    "h-10 bg-background/50 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 rounded-xl";

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10">
      <button
        onClick={() => navigate({ to: "/dashboard" })}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold tracking-tight mb-1">Create New Poll</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Fill in the details below and publish your poll.
      </p>

      {/* Form provider — gives all FormField children access to form context */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Poll details card ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6 space-y-4">
              <h2 className="font-semibold text-sm">Poll Details</h2>

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-medium">
                      Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What's your poll about?"
                        className={inputCls}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-medium">
                      Description{" "}
                      <span className="opacity-50">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add context for respondents…"
                        rows={2}
                        className="bg-background/50 border-border/60 rounded-xl resize-none focus-visible:ring-primary/50 focus-visible:border-primary/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Expires at */}
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground font-medium">
                        Expires at{" "}
                        <span className="opacity-50">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className={inputCls}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Anonymous toggle — shadcn Switch */}
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground font-medium">
                        Anonymous responses
                      </FormLabel>
                      <FormControl>
                        <div className="pt-1">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Question cards ── */}
          {questionFields.map((qField, qi) => (
            <motion.div
              key={qField.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.05 }}
            >
              <QuestionCard
                form={form}
                qi={qi}
                onRemove={() => removeQuestion(qi)}
                canRemove={questionFields.length > 1}
              />
            </motion.div>
          ))}

          {/* Array-level error (min 1 question) */}
          {form.formState.errors.questions?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.questions.message}
            </p>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                appendQuestion({
                  text: "",
                  mandatory: true,
                  options: [{ text: "" }, { text: "" }],
                })
              }
              className="flex-1 h-10 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Question
            </button>

            <ShimmerButton
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex-1 h-10"
            >
              {form.formState.isSubmitting ? "Publishing…" : "Create & Publish"}
            </ShimmerButton>
          </div>

        </form>
      </Form>
    </div>
  );
}