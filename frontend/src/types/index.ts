import type { LucideProps } from "lucide-react";

export interface Poll {
  id: string;
  creatorId: string;
  uniqueLink: string;
  description: string;
  title: string;
  isAnonymous: boolean;
  isPublished: boolean;
  createdAt: string;
  _count?: { responses: number; questions: number };
}
export interface Stats {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  value: number;
  color: string;
  bg: string;
};

export interface Analytics {
  totalResponses: number;
  optionCounts: {
    optionId: string;
    optionText: string;
    count: number;
    percentage: number;
  }[];
}