"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "@/components/ui/icons/plus";
import { createClient } from "@/utils/supabase/client";
import { gooey } from "@/components/ui/custom/gooey-toast";
import { useI18n } from "@/components/providers/i18n-provider";

type InterestOption = {
  name: string;
  subtopics?: string[];
};

const interestOptions: InterestOption[] = [
  // Foundations
  {
    name: "Mathematics",
    subtopics: ["Calculus", "Linear Algebra", "Statistics", "Discrete Math", "Number Theory", "Geometry"]
  },
  {
    name: "Logic & Reasoning",
    subtopics: ["Propositional Logic", "Predicate Logic", "Deductive Reasoning", "Inductive Reasoning", "Critical Analysis", "Logical Fallacies"]
  },
  {
    name: "Critical Thinking",
    subtopics: ["Problem Analysis", "Argument Evaluation", "Decision Making", "Research Skills", "Analytical Skills", "Cognitive Biases"]
  },
  {
    name: "Writing & Composition",
    subtopics: ["Essay Writing", "Technical Writing", "Creative Writing", "Academic Writing", "Editing", "Style & Grammar"]
  },
  {
    name: "Problem Solving",
    subtopics: ["Algorithmic Thinking", "Heuristics", "Design Thinking", "Root Cause Analysis", "Troubleshooting", "Strategy"]
  },

  // Computer Science & Technology
  {
    name: "Programming",
    subtopics: ["Python", "JavaScript", "Java", "C++", "Rust", "Go"]
  },
  {
    name: "Data Structures",
    subtopics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables", "Stacks & Queues"]
  },
  {
    name: "Algorithms",
    subtopics: ["Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms", "Graph Algorithms", "Complexity Analysis"]
  },
  {
    name: "Web Development",
    subtopics: ["HTML/CSS", "React", "Node.js", "APIs", "Responsive Design", "Web Performance"]
  },
  {
    name: "Systems Design",
    subtopics: ["Architecture", "Scalability", "Distributed Systems", "Microservices", "Load Balancing", "Caching"]
  },
  {
    name: "Databases",
    subtopics: ["SQL", "NoSQL", "Database Design", "Query Optimization", "Transactions", "PostgreSQL"]
  },
  {
    name: "APIs & Backend",
    subtopics: ["REST APIs", "GraphQL", "Authentication", "Server Architecture", "API Design", "Middleware"]
  },
  {
    name: "Frontend Engineering",
    subtopics: ["React", "Vue", "TypeScript", "State Management", "UI Components", "Performance"]
  },
  {
    name: "DevOps",
    subtopics: ["CI/CD", "Docker", "Kubernetes", "Cloud Platforms", "Monitoring", "Infrastructure as Code"]
  },
  {
    name: "Cybersecurity",
    subtopics: ["Network Security", "Cryptography", "Ethical Hacking", "Penetration Testing", "Security Best Practices", "Threat Analysis"]
  },

  // Data & AI
  {
    name: "Data Science",
    subtopics: ["Data Analysis", "Data Visualization", "Pandas", "NumPy", "Statistical Modeling", "Big Data"]
  },
  {
    name: "Machine Learning",
    subtopics: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Deep Learning", "Model Training", "Feature Engineering"]
  },
  {
    name: "Artificial Intelligence",
    subtopics: ["NLP", "Computer Vision", "Reinforcement Learning", "AI Ethics", "GPT Models", "AI Applications"]
  },
  {
    name: "Statistics",
    subtopics: ["Probability", "Hypothesis Testing", "Regression Analysis", "Bayesian Statistics", "Statistical Inference", "Distributions"]
  },
  {
    name: "Data Analysis",
    subtopics: ["Exploratory Analysis", "Data Cleaning", "Statistical Analysis", "Predictive Modeling", "A/B Testing", "Data Mining"]
  },

  // Sciences
  {
    name: "Physics",
    subtopics: ["Classical Mechanics", "Quantum Physics", "Electromagnetism", "Thermodynamics", "Relativity", "Particle Physics"]
  },
  {
    name: "Biology",
    subtopics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Molecular Biology", "Biochemistry"]
  },
  {
    name: "Chemistry",
    subtopics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry", "Chemical Reactions", "Molecular Structure"]
  },
  {
    name: "Environmental Science",
    subtopics: ["Climate Change", "Ecology", "Conservation", "Sustainability", "Renewable Energy", "Environmental Policy"]
  },
  {
    name: "Neuroscience",
    subtopics: ["Brain Structure", "Cognitive Neuroscience", "Neuroplasticity", "Neural Networks", "Behavior", "Memory & Learning"]
  },

  // Humanities & Social Sciences
  {
    name: "Philosophy",
    subtopics: ["Ethics", "Metaphysics", "Epistemology", "Logic", "Political Philosophy", "Existentialism"]
  },
  {
    name: "Psychology",
    subtopics: ["Cognitive Psychology", "Behavioral Psychology", "Social Psychology", "Developmental Psychology", "Clinical Psychology", "Neuroscience"]
  },
  {
    name: "History",
    subtopics: ["World History", "Modern History", "Ancient Civilizations", "Historical Analysis", "Cultural History", "Political History"]
  },
  {
    name: "Ethics",
    subtopics: ["Moral Philosophy", "Applied Ethics", "Bioethics", "Business Ethics", "AI Ethics", "Utilitarianism"]
  },
  {
    name: "Economics",
    subtopics: ["Microeconomics", "Macroeconomics", "Game Theory", "Behavioral Economics", "Economic Policy", "Market Analysis"]
  },
  {
    name: "Political Science",
    subtopics: ["Political Theory", "International Relations", "Comparative Politics", "Public Policy", "Government Systems", "Democracy"]
  },

  // Design & Communication
  {
    name: "Visual Design",
    subtopics: ["UI Design", "Graphic Design", "Typography", "Color Theory", "Layout Design", "Design Systems"]
  },
  {
    name: "UX Design",
    subtopics: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Interaction Design"]
  },
  {
    name: "Information Design",
    subtopics: ["Data Visualization", "Infographics", "Visual Storytelling", "Diagrams", "Information Architecture", "Visual Communication"]
  },
  {
    name: "Technical Writing",
    subtopics: ["Documentation", "API Documentation", "User Guides", "Technical Reports", "Clear Communication", "Content Strategy"]
  },
  {
    name: "Communication Skills",
    subtopics: ["Public Speaking", "Presentation Skills", "Active Listening", "Written Communication", "Persuasion", "Conflict Resolution"]
  },

  // Applied Skills
  {
    name: "Research Methods",
    subtopics: ["Qualitative Research", "Quantitative Research", "Experimental Design", "Data Collection", "Literature Review", "Analysis"]
  },
  {
    name: "Analytical Writing",
    subtopics: ["Argument Construction", "Critical Analysis", "Essay Structure", "Evidence Evaluation", "Academic Writing", "Persuasive Writing"]
  },
  {
    name: "Scientific Reasoning",
    subtopics: ["Hypothesis Testing", "Experimental Method", "Data Interpretation", "Scientific Method", "Evidence-Based Thinking", "Peer Review"]
  },
  {
    name: "Argumentation",
    subtopics: ["Logical Arguments", "Rhetoric", "Debate", "Fallacy Detection", "Persuasive Techniques", "Critical Thinking"]
  },
  {
    name: "Decision Making",
    subtopics: ["Risk Assessment", "Cost-Benefit Analysis", "Strategic Thinking", "Problem Solving", "Decision Frameworks", "Trade-offs"]
  },

  // Interdisciplinary
  {
    name: "Math for Computer Science",
    subtopics: ["Discrete Math", "Linear Algebra", "Probability", "Graph Theory", "Combinatorics", "Algorithm Analysis"]
  },
  {
    name: "AI Ethics",
    subtopics: ["Bias in AI", "Fairness", "Transparency", "Privacy", "Accountability", "Societal Impact"]
  },
  {
    name: "Technology & Society",
    subtopics: ["Digital Divide", "Social Impact", "Privacy Issues", "Technology Policy", "Digital Rights", "Future of Work"]
  },
  {
    name: "Science Communication",
    subtopics: ["Public Engagement", "Science Writing", "Media Relations", "Education", "Visual Communication", "Storytelling"]
  }
];

const initialVisible = 36;

export default function Page() {
  const supabase = createClient();
  const { t } = useI18n();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be signed in.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_data")
        .eq("id", user.id)
        .single();

      if (profileError) throw new Error(profileError.message);

      const interests = profile?.onboarding_data?.interests || [];
      setSelectedInterests(interests);
    } catch (error: unknown) {
      console.error("Error loading interests:", error);
      gooey.error({ 
        title: t("interests.toast.loadError"),
        description: "Unable to load your interests. Please refresh the page." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (topicName: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (selectedInterests.length < 3) {
      gooey.error({ 
        title: "More interests needed",
        description: t("interests.toast.minSelection") 
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be signed in.");

      // Get existing onboarding data
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("onboarding_data")
        .eq("id", user.id)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      // Update interests while preserving other onboarding data
      const updatedOnboardingData = {
        ...(profile?.onboarding_data || {}),
        interests: selectedInterests
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_data: updatedOnboardingData })
        .eq("id", user.id);

      if (updateError) throw new Error(updateError.message);

      gooey.success({ 
        title: "Interests saved",
        description: t("interests.toast.success") 
      });
    } catch (error: unknown) {
      console.error("Error saving interests:", error);
      const message = error instanceof Error ? error.message : t("interests.toast.error");
      gooey.error({ 
        title: "Failed to save",
        description: message || t("interests.toast.error") 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const visibleInterests = showAll ? interestOptions : interestOptions.slice(0, initialVisible);

  if (isLoading) {
    return (
      <div className="text-center py-8">{t("interests.loading")}</div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold mb-1">{t("interests.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("interests.description")}
        </p>
      </div>

      {/* Currently Selected Interests */}
      {selectedInterests.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium">
            {t("interests.currentlySelected", { count: selectedInterests.length })}
          </div>
          <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            {selectedInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-medium transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                <span>{interest}</span>
                <Plus className="h-3 w-3 rotate-45 transition-transform" animateOnHover />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Selected count */}
        <div className="flex items-center justify-between text-sm pb-2">
          <div className="text-muted-foreground">
            {t("interests.selectedCount", { count: selectedInterests.length })}{" "}
            {selectedInterests.length < 3 && (
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                — {t("interests.selectedMoreNeeded", { count: 3 - selectedInterests.length })}
              </span>
            )}
          </div>
        </div>

        {/* Interests grid */}
        <div className="flex flex-wrap gap-2.5 max-h-[65vh] overflow-y-auto px-1 py-2">
          {visibleInterests.map((interest) => {
            const isExpanded = expandedTopics.has(interest.name);
            const hasSubtopics = interest.subtopics && interest.subtopics.length > 0;
            
            return (
              <React.Fragment key={interest.name}>
                <button
                  onClick={() => hasSubtopics ? toggleExpand(interest.name) : toggleInterest(interest.name)}
                  className={`
                    inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200
                    ${isExpanded 
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                      : "bg-background text-foreground border-border/60 hover:border-primary/50 hover:bg-accent/50 hover:scale-105 active:scale-95"
                    }
                  `}
                >
                  <span>{interest.name}</span>
                  <Plus 
                    className={`h-4 w-4 transition-transform duration-300 ease-out ${
                      isExpanded ? "rotate-45" : "group-hover:rotate-90"
                    }`}
                    animateOnHover
                  />
                </button>
                
                {isExpanded && hasSubtopics && interest.subtopics!.map((subtopic) => {
                  const isSubtopicSelected = selectedInterests.includes(subtopic);
                  return (
                    <button
                      key={subtopic}
                      onClick={() => toggleInterest(subtopic)}
                      className={`
                        inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 animate-in fade-in zoom-in-95
                        ${isSubtopicSelected 
                          ? "bg-primary/90 text-primary-foreground border-primary shadow-md scale-105" 
                          : "bg-background text-foreground border-border/40 hover:border-primary/40 hover:bg-accent/50 hover:scale-105 active:scale-95"
                        }
                      `}
                    >
                      <span>{subtopic}</span>
                      <Plus 
                        className={`h-3 w-3 transition-transform duration-300 ${
                          isSubtopicSelected ? "rotate-45" : ""
                        }`}
                        animateOnHover
                      />
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {!showAll && interestOptions.length > initialVisible && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors font-medium"
            >
              {t("interests.showMore")} ({interestOptions.length - initialVisible} more)
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={selectedInterests.length < 3 || isSaving}
          size="lg"
          className="min-w-[140px]"
        >
          {isSaving ? t("interests.savingButton") : t("interests.saveButton")}
        </Button>
      </div>
    </div>
  );
}
