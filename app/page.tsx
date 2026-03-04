"use client";

import { useState, useRef, useCallback } from "react";
import type { SpamCheckResult } from "./api/test/route";

interface FormData {
    subject: string;
    from: string;
    to: string;
    htmlBody: string;
    textBody: string;
}

const INITIAL_FORM: FormData = {
    subject: "",
    from: "",
    to: "",
    htmlBody: "",
    textBody: "",
};

const SAMPLE_EMAIL = {
    subject: "🔥 LIMITED TIME: 90% OFF Everything — Act NOW!!!",
    from: "deals@free-offers-now.com",
    to: "you@gmail.com",
    htmlBody: `<html><body>
<h1>CONGRATULATIONS!! You've been selected!</h1>
<p>CLICK HERE to claim your FREE prize worth $$$!</p>
<p>This is not spam. Unsubscribe anytime. Buy now and SAVE BIG!</p>
<p>Visit our site: http://totally-legit-deals.tk/free-money</p>
</body></html>`,
    textBody:
        "CONGRATULATIONS!! Click here for FREE money! Buy now! Limited offer! You have been selected! Act fast!",
};

function ScoreMeter({ score }: { score: number }) {
    const pct = Math.min(100, Math.round((score / 10) * 100));
    const color =
        score < 2 ? "#22c55e" : score < 5 ? "#eab308" : "#ef4444";

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: "var(--muted)" }}
                >
                    Spam Score
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                    0 — 10
                </span>
            </div>
            <div
                className="h-2 rounded-full w-full overflow-hidden"
                style={{ background: "var(--border)" }}
            >
                <div
                    className="h-2 rounded-full fill-meter"
                    style={{
                        width: `${pct}%`,
                        background: color,
                        transition: "width 1s ease-out",
                    }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-xs font-mono" style={{ color: "#22c55e" }}>
                    Safe
                </span>
                <span className="text-xs font-mono" style={{ color: "#eab308" }}>
                    Risky
                </span>
                <span className="text-xs font-mono" style={{ color: "#ef4444" }}>
                    Spam
                </span>
            </div>
        </div>
    );
}

function TrafficLight({ level }: { level: "low" | "medium" | "high" }) {
    const lights = [
        { id: "red", active: level === "high", color: "#ef4444", inactive: "#3a1a1a" },
        { id: "yellow", active: level === "medium", color: "#eab308", inactive: "#2a2400" },
        { id: "green", active: level === "low", color: "#22c55e", inactive: "#0a2a14" },
    ];

    const pulseClass =
        level === "high"
            ? "pulse-red"
            : level === "medium"
                ? "pulse-yellow"
                : "pulse-green";

    return (
        <div
            className="flex flex-col items-center gap-3 p-4 rounded-2xl"
            style={{ background: "#111", border: "1px solid #222" }}
        >
            {lights.map((light) => (
                <div
                    key={light.id}
                    className={`w-8 h-8 rounded-full transition-all duration-500 ${light.active ? pulseClass : ""
                        }`}
                    style={{
                        background: light.active ? light.color : light.inactive,
                        boxShadow: light.active
                            ? `0 0 20px ${light.color}88`
                            : "none",
                    }}
                />
            ))}
        </div>
    );
}

function LemonUpsell({ riskLevel }: { riskLevel: "low" | "medium" | "high" }) {
    const messages = {
        low: {
            headline: "Looking clean — but clean tests don't guarantee opens.",
            sub: "Lemon says you're safe. Yahoo, Outlook, and Apple Mail disagree more often than you'd think.",
        },
        medium: {
            headline: "Borderline scores fail in production.",
            sub: "You're in the grey zone. 40% of emails at this score land in promotions or spam on mobile clients.",
        },
        high: {
            headline: "This email won't reach inboxes. Full stop.",
            sub: "High spam scores mean Outlook black holes, Gmail promotions tab, and silent Yahoo drops.",
        },
    };

    const msg = messages[riskLevel];

    return (
        <div className="relative mt-8 slide-up slide-up-delay-3">
            {/* Shimmer border */}
            <div className="absolute -inset-0.5 rounded-2xl shimmer-border opacity-70" />
            <div
                className="relative rounded-2xl p-8"
                style={{ background: "#0D0D0D" }}
            >
                {/* Lemon badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🍋</span>
                    <span
                        className="text-xs font-mono uppercase tracking-widest"
                        style={{ color: "#FFDD00" }}
                    >
                        Lemon Email
                    </span>
                </div>

                <h3
                    className="font-display text-2xl text-white mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    {msg.headline}
                </h3>
                <p className="text-sm mb-6" style={{ color: "#999" }}>
                    {msg.sub}
                </p>

                {/* Value props */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                    {[
                        {
                            icon: "⚡",
                            text: "Routes to 7+ providers automatically",
                            sub: "Fixing Outlook/Yahoo black holes silently",
                        },
                        {
                            icon: "📈",
                            text: "45% opens guaranteed",
                            sub: "Or your money back. No asterisks.",
                        },
                        {
                            icon: "🛡️",
                            text: "Real-time reputation monitoring",
                            sub: "Know before your list does",
                        },
                    ].map((item) => (
                        <div key={item.text} className="flex items-start gap-3">
                            <span className="text-lg mt-0.5">{item.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-white">{item.text}</p>
                                <p className="text-xs" style={{ color: "#666" }}>
                                    {item.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="https://lemon.email"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-6 py-4 rounded-xl font-medium text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: "#FFDD00",
                        color: "#0D0D0D",
                    }}
                >
                    <span className="font-display text-base" style={{ fontFamily: "var(--font-display)" }}>
                        Start with Lemon Email →
                    </span>
                    <span
                        className="font-mono text-xs px-2 py-1 rounded-lg"
                        style={{ background: "rgba(0,0,0,0.15)" }}
                    >
                        $9/mo
                    </span>
                </a>

                <p
                    className="text-center text-xs mt-3"
                    style={{ color: "#444" }}
                >
                    No free tier. Serious deliverability for serious senders.
                </p>
            </div>
        </div>
    );
}

function ResultsPanel({
    result,
    htmlBody,
}: {
    result: SpamCheckResult;
    htmlBody: string;
}) {
    const [tab, setTab] = useState<"score" | "preview" | "report">("score");

    const riskLabels = {
        low: { label: "Looks Good", color: "#22c55e", bg: "#052010" },
        medium: { label: "Risky", color: "#eab308", bg: "#1a1500" },
        high: { label: "Likely Spam", color: "#ef4444", bg: "#200505" },
    };

    const risk = riskLabels[result.riskLevel];

    return (
        <div className="slide-up">
            {/* Score hero */}
            <div
                className="rounded-2xl p-8 mb-6 flex items-start gap-6"
                style={{ background: risk.bg, border: `1px solid ${risk.color}22` }}
            >
                <TrafficLight level={result.riskLevel} />

                <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                        <span
                            className="font-mono text-6xl font-medium score-reveal"
                            style={{ color: risk.color }}
                        >
                            {result.score.toFixed(1)}
                        </span>
                        <span
                            className="text-sm font-mono"
                            style={{ color: "var(--muted)" }}
                        >
                            / 10
                        </span>
                    </div>
                    <p
                        className="font-display text-xl mb-1"
                        style={{ fontFamily: "var(--font-display)", color: risk.color }}
                    >
                        {risk.label}
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Your email has approximately{" "}
                        <strong style={{ color: "var(--ink)" }}>
                            {result.riskPercent}% spam risk
                        </strong>{" "}
                        across major inboxes.
                    </p>

                    <div className="mt-4">
                        <ScoreMeter score={result.score} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div
                className="flex gap-1 p-1 rounded-xl mb-4"
                style={{ background: "var(--border)" }}
            >
                {(["score", "preview", "report"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                        style={{
                            background: tab === t ? "white" : "transparent",
                            color: tab === t ? "var(--ink)" : "var(--muted)",
                            boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                        }}
                    >
                        {t === "score" ? "Analysis" : t === "preview" ? "Preview" : "Report"}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === "score" && (
                <div className="space-y-3 slide-up slide-up-delay-1">
                    {/* Thresholds */}
                    {result.thresholds.length > 0 && (
                        <div
                            className="rounded-xl p-5"
                            style={{
                                background: "white",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <p
                                className="text-xs font-mono uppercase tracking-widest mb-4"
                                style={{ color: "var(--muted)" }}
                            >
                                Provider Thresholds
                            </p>
                            <div className="space-y-3">
                                {result.thresholds.slice(0, 6).map((t) => (
                                    <div key={t.Name} className="flex items-center gap-3">
                                        <span
                                            className="text-xs w-24 shrink-0"
                                            style={{ color: "var(--muted)" }}
                                        >
                                            {t.Name}
                                        </span>
                                        <div
                                            className="flex-1 h-1.5 rounded-full overflow-hidden"
                                            style={{ background: "var(--border)" }}
                                        >
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{
                                                    width: `${Math.min(100, (t.Value / 10) * 100)}%`,
                                                    background:
                                                        result.score >= t.Value ? "#ef4444" : "#22c55e",
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono w-8 text-right" style={{ color: "var(--muted)" }}>
                                            {t.Value}
                                        </span>
                                        <span className="text-xs">
                                            {result.score >= t.Value ? "❌" : "✅"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick checks */}
                    <div
                        className="rounded-xl p-5"
                        style={{ background: "white", border: "1px solid var(--border)" }}
                    >
                        <p
                            className="text-xs font-mono uppercase tracking-widest mb-4"
                            style={{ color: "var(--muted)" }}
                        >
                            Quick Checks
                        </p>
                        <div className="space-y-2">
                            {[
                                {
                                    check: "Score below Gmail threshold (5.0)",
                                    pass: result.score < 5,
                                },
                                {
                                    check: "Score below SpamAssassin default (5.0)",
                                    pass: result.score < 5,
                                },
                                {
                                    check: "Score below Outlook aggressive (4.0)",
                                    pass: result.score < 4,
                                },
                                {
                                    check: "Considered safe (< 2.0)",
                                    pass: result.score < 2,
                                },
                            ].map((item) => (
                                <div
                                    key={item.check}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-sm">
                                        {item.pass ? "✅" : "❌"}
                                    </span>
                                    <span
                                        className="text-sm"
                                        style={{ color: item.pass ? "var(--ink)" : "#ef4444" }}
                                    >
                                        {item.check}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {tab === "preview" && (
                <div
                    className="rounded-xl overflow-hidden slide-up slide-up-delay-1"
                    style={{ border: "1px solid var(--border)" }}
                >
                    <div
                        className="px-4 py-2 flex items-center gap-2"
                        style={{ background: "var(--border)" }}
                    >
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span
                            className="text-xs font-mono ml-2"
                            style={{ color: "var(--muted)" }}
                        >
                            Email Preview
                        </span>
                    </div>
                    {htmlBody ? (
                        <iframe
                            srcDoc={htmlBody}
                            className="w-full bg-white"
                            style={{ height: "400px", border: "none" }}
                            sandbox="allow-same-origin"
                            title="Email HTML Preview"
                        />
                    ) : (
                        <div
                            className="flex items-center justify-center h-40"
                            style={{ background: "white", color: "var(--muted)" }}
                        >
                            <p className="text-sm">No HTML body provided</p>
                        </div>
                    )}
                </div>
            )}

            {tab === "report" && (
                <div
                    className="rounded-xl p-5 slide-up slide-up-delay-1"
                    style={{ background: "white", border: "1px solid var(--border)" }}
                >
                    <p
                        className="text-xs font-mono uppercase tracking-widest mb-4"
                        style={{ color: "var(--muted)" }}
                    >
                        SpamAssassin Report
                    </p>
                    {result.report.length > 0 ? (
                        <div className="space-y-2">
                            {result.report.map((line, i) => (
                                <p
                                    key={i}
                                    className="text-xs font-mono p-2 rounded-lg"
                                    style={{
                                        background: "#FAFAF7",
                                        color: "var(--ink)",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                            No detailed report available for this score.
                        </p>
                    )}
                </div>
            )}

            {/* Lemon upsell */}
            <LemonUpsell riskLevel={result.riskLevel} />
        </div>
    );
}

export default function Home() {
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SpamCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"html" | "text">("html");
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleSubmit = useCallback(async () => {
        if (!form.subject || !form.from) {
            setError("Please fill in Subject and From fields.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Test failed");
            }

            setResult(data);
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, [form]);

    const loadSample = () => {
        setForm(SAMPLE_EMAIL);
        setResult(null);
        setError(null);
    };

    return (
        <div className="relative min-h-screen" style={{ zIndex: 1 }}>
            {/* Header */}
            <header
                className="border-b"
                style={{ borderColor: "var(--border)", background: "rgba(250,250,247,0.8)", backdropFilter: "blur(12px)" }}
            >
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🍋</span>
                        <span
                            className="font-display text-xl"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Lemon
                            <span className="font-sans font-light text-base ml-1" style={{ color: "var(--muted)" }}>
                                / Email Tester
                            </span>
                        </span>
                    </a>
                    <a
                        href="https://lemon.email"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: "#FFDD00", color: "#0D0D0D" }}
                    >
                        Lemon Email →
                    </a>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-6"
                        style={{
                            background: "#fff9c4",
                            color: "#7c6800",
                            border: "1px solid #f9a825",
                        }}
                    >
                        <span>●</span> Free · No signup · Instant results
                    </div>
                    <h1
                        className="font-display text-5xl md:text-6xl mb-4 leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Will your email
                        <br />
                        <em>actually reach</em> inboxes?
                    </h1>
                    <p
                        className="text-lg max-w-xl mx-auto"
                        style={{ color: "var(--muted)" }}
                    >
                        Test deliverability before you send. Get your spam score, provider
                        thresholds, and a full HTML preview — free.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
                        <div
                            className="rounded-2xl p-6 mb-4"
                            style={{
                                background: "white",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <p
                                    className="text-xs font-mono uppercase tracking-widest"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Email Details
                                </p>
                                <button
                                    onClick={loadSample}
                                    className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors hover:opacity-70"
                                    style={{
                                        background: "var(--border)",
                                        color: "var(--muted)",
                                    }}
                                >
                                    Load spam example
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Subject */}
                                <div>
                                    <label
                                        className="block text-xs font-mono uppercase tracking-wider mb-1.5"
                                        style={{ color: "var(--muted)" }}
                                    >
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.subject}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, subject: e.target.value }))
                                        }
                                        placeholder="Your email subject line"
                                        className="w-full px-4 py-3 rounded-xl text-sm border transition-colors"
                                        style={{
                                            border: "1px solid var(--border)",
                                            background: "var(--bg)",
                                            color: "var(--ink)",
                                        }}
                                    />
                                </div>

                                {/* From / To */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label
                                            className="block text-xs font-mono uppercase tracking-wider mb-1.5"
                                            style={{ color: "var(--muted)" }}
                                        >
                                            From *
                                        </label>
                                        <input
                                            type="email"
                                            value={form.from}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, from: e.target.value }))
                                            }
                                            placeholder="you@domain.com"
                                            className="w-full px-3 py-3 rounded-xl text-sm border"
                                            style={{
                                                border: "1px solid var(--border)",
                                                background: "var(--bg)",
                                                color: "var(--ink)",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-xs font-mono uppercase tracking-wider mb-1.5"
                                            style={{ color: "var(--muted)" }}
                                        >
                                            To
                                        </label>
                                        <input
                                            type="email"
                                            value={form.to}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, to: e.target.value }))
                                            }
                                            placeholder="test@gmail.com"
                                            className="w-full px-3 py-3 rounded-xl text-sm border"
                                            style={{
                                                border: "1px solid var(--border)",
                                                background: "var(--bg)",
                                                color: "var(--ink)",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Body tabs */}
                                <div>
                                    <div className="flex gap-1 mb-2">
                                        {(["html", "text"] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTab(t)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                                                style={{
                                                    background:
                                                        activeTab === t ? "var(--ink)" : "transparent",
                                                    color:
                                                        activeTab === t ? "white" : "var(--muted)",
                                                }}
                                            >
                                                {t === "html" ? "HTML Body" : "Text Body"}
                                            </button>
                                        ))}
                                    </div>

                                    {activeTab === "html" ? (
                                        <textarea
                                            value={form.htmlBody}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, htmlBody: e.target.value }))
                                            }
                                            placeholder="<html><body><h1>Your email content here</h1></body></html>"
                                            rows={8}
                                            className="w-full px-4 py-3 rounded-xl text-xs font-mono border resize-none"
                                            style={{
                                                border: "1px solid var(--border)",
                                                background: "var(--bg)",
                                                color: "var(--ink)",
                                                lineHeight: "1.6",
                                            }}
                                        />
                                    ) : (
                                        <textarea
                                            value={form.textBody}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, textBody: e.target.value }))
                                            }
                                            placeholder="Plain text version of your email..."
                                            rows={8}
                                            className="w-full px-4 py-3 rounded-xl text-sm border resize-none"
                                            style={{
                                                border: "1px solid var(--border)",
                                                background: "var(--bg)",
                                                color: "var(--ink)",
                                                lineHeight: "1.7",
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div
                                className="px-4 py-3 rounded-xl text-sm mb-4"
                                style={{
                                    background: "#200505",
                                    color: "#ef4444",
                                    border: "1px solid #ef444422",
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 rounded-xl font-medium text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            style={{
                                background: "#0D0D0D",
                                color: "#FFDD00",
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="spin-slow"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeOpacity="0.3"
                                        />
                                        <path
                                            d="M12 2a10 10 0 0 1 10 10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Checking deliverability…
                                </>
                            ) : (
                                <>
                                    <span>🍋</span>
                                    Run Email Test →
                                </>
                            )}
                        </button>

                        <p
                            className="text-center text-xs mt-3"
                            style={{ color: "var(--muted)" }}
                        >
                            Powered by Lemon Email · No data stored
                        </p>
                    </div>

                    {/* Results */}
                    <div ref={resultsRef}>
                        {!result && !loading && (
                            <div
                                className="rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center"
                                style={{
                                    border: "1px dashed var(--border)",
                                    background: "white",
                                }}
                            >
                                <p className="text-4xl mb-4">📬</p>
                                <p
                                    className="font-display text-xl mb-2"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Results appear here
                                </p>
                                <p className="text-sm" style={{ color: "var(--muted)" }}>
                                    Fill in your email details and hit{" "}
                                    <strong>Run Email Test</strong> to see your spam score,
                                    provider thresholds, and HTML preview.
                                </p>

                                <div
                                    className="mt-8 p-4 rounded-xl text-left w-full max-w-xs"
                                    style={{ background: "var(--bg)" }}
                                >
                                    <p
                                        className="text-xs font-mono uppercase tracking-widest mb-3"
                                        style={{ color: "var(--muted)" }}
                                    >
                                        What you'll get
                                    </p>
                                    {[
                                        "Spam score (0–10)",
                                        "Traffic light risk level",
                                        "Provider threshold comparison",
                                        "HTML email preview",
                                        "SpamAssassin report",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2 mb-1.5">
                                            <span style={{ color: "#22c55e" }}>✓</span>
                                            <span className="text-xs" style={{ color: "var(--ink)" }}>
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div
                                className="rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center"
                                style={{
                                    border: "1px solid var(--border)",
                                    background: "white",
                                }}
                            >
                                <div className="text-4xl mb-4">
                                    <svg
                                        className="spin-slow mx-auto"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="#E8E8E0"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M12 2a10 10 0 0 1 10 10"
                                            stroke="#FFDD00"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <p
                                    className="font-display text-xl mb-2"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Running spam checks…
                                </p>
                                <p className="text-sm" style={{ color: "var(--muted)" }}>
                                    Checking against 6 provider thresholds
                                </p>
                            </div>
                        )}

                        {result && <ResultsPanel result={result} htmlBody={form.htmlBody} />}
                    </div>
                </div>

                {/* Standalone upsell section */}
                {!result && (
                    <div
                        className="mt-16 rounded-2xl p-8 md:p-12 text-center"
                        style={{ background: "#0D0D0D" }}
                    >
                        <span className="text-4xl">🍋</span>
                        <h2
                            className="font-display text-3xl md:text-4xl text-white mt-4 mb-3"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Tests like this fail in production.
                        </h2>
                        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "#999" }}>
                            Lemon routes to 7+ providers automatically, fixing Outlook/Yahoo
                            black holes. <strong className="text-white">45% opens guaranteed</strong> or
                            your money back.
                        </p>
                        <a
                            href="https://lemon.email"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-base transition-all hover:opacity-90 hover:scale-105"
                            style={{ background: "#FFDD00", color: "#0D0D0D" }}
                        >
                            <span>Sign up Lemon →</span>
                            <span
                                className="font-mono text-xs px-2 py-1 rounded-lg"
                                style={{ background: "rgba(0,0,0,0.15)" }}
                            >
                                $9/mo
                            </span>
                        </a>
                        <p className="text-xs mt-3" style={{ color: "#444" }}>
                            Gumroad · Cancel anytime · No free tier
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer
                className="mt-16 border-t"
                style={{ borderColor: "var(--border)" }}
            >
                <div
                    className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-2">
                        <span>🍋</span>
                        <div>
                            <p className="text-sm font-medium">Powered by Lemon Email</p>
                            <p className="text-xs" style={{ color: "var(--muted)" }}>
                                Better deliverability. Fewer headaches.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://lemon.email"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono hover:opacity-70 transition-opacity"
                        style={{ color: "var(--muted)" }}
                    >
                        lemon.email →
                    </a>
                </div>
            </footer>
        </div>
    );
}