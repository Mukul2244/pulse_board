import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { apiClient } from "../../../api/client";
import { GlassCard, ShimmerButton } from "@/components/ui/aceternity";
import { CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/poll/$id/")({ component: TakePoll });

function TakePoll() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expired, setExpired] = useState(false);
  const fetchPoll = async () => {
    try {
      const response = await apiClient.get(`/polls/${id}`);
      const data = response.data.data;
      setPoll(data);
      if (data.expiresAt && new Date(data.expiresAt) < new Date())
        setExpired(true);
    } catch (error) {
      console.error("Failed to fetch poll", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const submitResponse = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
        questionId: qId,
        optionId: oId,
      }));
      await apiClient.post(`/polls/${id}/responses`, {
        answers: formattedAnswers,
      });
      // navigate({ to: "/poll/$id/analytics", params: { id } });
    } catch (error) {
      console.error("Failed to submit response", error);
    } finally {
      setSubmitting(false);
    }
  };

  const mandatory =
    poll?.questions?.filter((q: any) => q.isMandatory !== false) ?? [];
  const allMandatoryAnswered = mandatory.every((q: any) => answers[q.id]);
  const answeredCount = Object.keys(answers).length;
  const totalQ = poll?.questions?.length || 0;

  if (loading)
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );

  if (!poll)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        Poll not found
      </div>
    );

  if (expired)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Poll Expired</h2>
        <p className="text-muted-foreground text-sm">
          This poll is no longer accepting responses.
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6 mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-muted-foreground text-sm mb-4">
              {poll.description}
            </p>
          )}
          {poll.expiresAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
              <Clock className="w-3 h-3" /> Expires{" "}
              {new Date(poll.expiresAt).toLocaleString()}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{
                  width: totalQ ? `${(answeredCount / totalQ) * 100}%` : "0%",
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {answeredCount}/{totalQ}
            </span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Questions */}
      <div className="space-y-4">
        {poll.questions?.map((q: any, i: number) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                    answers[q.id]
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {answers[q.id] ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <div>
                  <h3 className="font-medium leading-snug">{q.text}</h3>
                  {q.isMandatory === false && (
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 pl-9">
                {q.options?.map((opt: any) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? "border-primary bg-primary/8 text-foreground"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selected
                            ? "border-primary"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {selected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={selected}
                        onChange={() =>
                          setAnswers({ ...answers, [q.id]: opt.id })
                        }
                        className="sr-only"
                      />
                      <span className="text-sm">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <ShimmerButton
          onClick={submitResponse}
          disabled={!allMandatoryAnswered || submitting}
          className="h-11 px-8"
        >
          {submitting ? "Submitting…" : "Submit Response →"}
        </ShimmerButton>
      </div>
    </div>
  );
}
