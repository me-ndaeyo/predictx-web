"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Info, PlayCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceSectionProps {
    matchId: string;
    className?: string;
}

// Mock evidence data
const getMockEvidence = (_matchId: string) => {
    return [
        { time: "14'", event: "Yellow Card - Semedo (WOL)" },
        { time: "23'", event: "⚽ Goal! Calvert-Lewin (EVE) - Assist: McNeil" },
        { time: "45+2'", event: "Half Time: Everton 1 - 0 Wolves" },
        { time: "55'", event: "⚽ Goal! Hwang Hee-chan (WOL)" },
        { time: "78'", event: "⚽ Goal! Doucoure (EVE)" },
        { time: "89'", event: "VAR Check: Potential Penalty (WOL) - No Penalty Given" },
        { time: "90+5'", event: "Full Time" },
    ];
};

export function EvidenceSection({ matchId, className }: EvidenceSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const events = getMockEvidence(matchId);

    return (
        <div className={cn("bg-background/40 rounded-lg border border-border/50 overflow-hidden", className)}>
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-surface/50 hover:bg-surface transition-colors focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/20 rounded-md">
                        <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-display font-bold uppercase text-sm tracking-wider">
                        Match Evidence & Logs
                    </span>
                    <div className="group relative ml-2">
                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-background border border-border rounded text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Review the evidence before voting to earn maximum rewards
                        </div>
                    </div>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-4 border-t border-border/50 space-y-5">

                            {/* External Links */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex-1 flex items-center gap-2 p-3 bg-background rounded border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <PlayCircle className="w-5 h-5 text-primary group-hover:text-glow-cyan" />
                                    <span className="text-sm font-medium">View Match Highlights</span>
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex-1 flex items-center gap-2 p-3 bg-background rounded border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">Official Premier League Stats</span>
                                </a>
                            </div>

                            {/* Event Timeline */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                                    Key Event Timeline
                                </h4>
                                <div className="space-y-3 bg-background/50 rounded p-4 font-mono text-sm">
                                    {events.map((evt, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="text-primary w-12 shrink-0">{evt.time}</span>
                                            <span className="text-foreground/90">{evt.event}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
