import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { API } from "../api";
import { toast } from "sonner";
import { GlassCard, AnimatedNumber } from "@/components/ui/aceternity";
import {
  PlusCircle,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  ExternalLink,
  Trash2,
  Copy,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Poll, Stats } from "@/types";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPolls = async () => {
    try {
      const response = await API.polls.getAll();
      setPolls(response.data.data || []);
      console.log(response);
    } catch (error) {
      setPolls([]);
      toast.error("Error fetching polls");
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate({ to: "/login" });
      return;
    }
    fetchPolls();
  }, [navigate]);

  const totalResponses = polls.reduce(
    (s, p) => s + (p._count?.responses || 0),
    0,
  );
  const published = polls.filter((p) => p.isPublished).length;

  const stats = [
    {
      icon: FileText,
      label: "Total Polls",
      value: polls.length,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "Published",
      value: published,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Users,
      label: "Responses",
      value: totalResponses,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: BarChart3,
      label: "Drafts",
      value: polls.length - published,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${id}`);
    toast.success("Link copied to clipboard");
  };
  const deletePoll = async (id: string) => {
    if (!confirm("Delete this poll?")) return;
    try {
      await API.polls.delete(id);
      setPolls((p) => p.filter((x) => x.id !== id));
      toast.success("Poll deleted successfully");
    } catch {
      toast.error("Failed to delete poll");
    }
  };
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10 ">
      <Header />
      <Stats stats={stats} />
      <GlassCard className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
          <h2 className="text-sm font-semibold">Your Polls</h2>
          <span className="text-xs text-muted-foreground">
            {polls.length} total
          </span>
        </div>

        {loading ? (
          <div className="divide-y divide-border/30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : polls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">No polls yet</p>
            <p className="text-muted-foreground text-xs mb-5">
              Create your first poll to get started
            </p>
            <Link to="/poll/new">
              <button className="flex items-center gap-1.5 h-8 px-4 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <PlusCircle className="w-3 h-3" /> Create Poll
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {polls.map((poll, i) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {poll.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                        poll.isPublished
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-amber-500/15 text-amber-500"
                      }`}
                    >
                      {poll.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>
                  {/* <span className="text-xs text-muted-foreground mt-0.5">
                    {poll.description}
                  </span> */}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {poll._count?.questions ?? 0} questions ·{" "}
                    {poll._count?.responses ?? 0} responses
                    {poll.createdAt ? ` · ${fmt(poll.createdAt)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {[
                    {
                      icon: Copy,
                      action: () => copyLink(poll.uniqueLink),
                      title: "Copy link",
                      hover: "hover:text-foreground",
                    },
                  ].map(({ icon: Icon, action, title, hover }) => (
                    <button
                      key={title}
                      onClick={action}
                      title={title}
                      className={`w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground ${hover} transition-colors`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  <Link
                    to="/poll/$id/analytics"
                    params={{ id: poll.uniqueLink }}
                  >
                    <button
                      title="Analytics"
                      className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => deletePoll(poll.uniqueLink)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

const Header = () => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground text-sm mt-0.5">
        Manage your polls and track responses
      </p>
    </div>
    <Link to="/poll/new">
      <button className="flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
        <PlusCircle className="w-3.5 h-3.5" /> New Poll
      </button>
    </Link>
  </div>
);

const Stats = ({ stats }: { stats: Stats[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
    {stats.map((s, i) => (
      <motion.div
        key={s.label}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06 }}
      >
        <GlassCard className="p-4 flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}
          >
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">
              <AnimatedNumber value={s.value} />
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
          </div>
        </GlassCard>
      </motion.div>
    ))}
  </div>
);
