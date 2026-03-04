import { NextRequest, NextResponse } from "next/server";

export interface SpamCheckRequest {
    subject: string;
    from: string;
    to: string;
    htmlBody: string;
    textBody: string;
}

export interface SpamThreshold {
    Name: string;
    Value: number;
}

export interface SpamCheckResult {
    score: number;
    thresholds: SpamThreshold[];
    isSpam: boolean;
    report: string[];
    riskLevel: "low" | "medium" | "high";
    riskPercent: number;
}

interface PostmarkRule {
    score: string | number;
    description: string;
}

// Postmark returns: { success: true, score: "11.9", rules: [...], report: "..." }
// IMPORTANT: score is always a STRING like "11.9" — not a number
function parsePostmarkResponse(data: Record<string, unknown>): {
    score: number;
    thresholds: SpamThreshold[];
    report: string[];
} {
    // score is a string like "11.9" or "3.6" — parseFloat it
    const rawScore = data.score ?? data.SpamScore ?? "0";
    const score = parseFloat(String(rawScore));

    // Fixed provider thresholds — Postmark doesn't return these
    const thresholds: SpamThreshold[] = [
        { Name: "Gmail", Value: 5.0 },
        { Name: "Outlook", Value: 4.0 },
        { Name: "Yahoo", Value: 5.0 },
        { Name: "SpamAssassin", Value: 5.0 },
        { Name: "Apple Mail", Value: 6.0 },
        { Name: "Strict", Value: 2.0 },
    ];

    // Build report from rules array, sorted by score descending
    const rules: PostmarkRule[] = Array.isArray(data.rules) ? data.rules : [];
    const report: string[] = rules
        .map((r) => ({ pts: parseFloat(String(r.score)), desc: r.description }))
        .filter((r) => r.pts > 0 && r.desc)
        .sort((a, b) => b.pts - a.pts)
        .map((r) => `[+${r.pts.toFixed(1)}] ${r.desc}`)
        .slice(0, 12);

    return { score: isNaN(score) ? 0 : score, thresholds, report };
}

function getRiskLevel(score: number): {
    riskLevel: "low" | "medium" | "high";
    riskPercent: number;
} {
    if (score < 2) return { riskLevel: "low", riskPercent: Math.round((score / 2) * 20) };
    if (score < 5) return { riskLevel: "medium", riskPercent: 20 + Math.round(((score - 2) / 3) * 45) };
    return { riskLevel: "high", riskPercent: Math.min(99, 65 + Math.round(((score - 5) / 5) * 35)) };
}

export async function POST(req: NextRequest) {
    try {
        const body: SpamCheckRequest = await req.json();

        if (!body.subject || !body.from) {
            return NextResponse.json(
                { error: "Subject and From fields are required." },
                { status: 400 }
            );
        }

        const emailContent = [
            `From: ${body.from}`,
            `To: ${body.to || "test@example.com"}`,
            `Subject: ${body.subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            ``,
            body.htmlBody || body.textBody || "Test email content",
        ].join("\r\n");

        const postmarkResponse = await fetch(
            "https://spamcheck.postmarkapp.com/filter",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: emailContent, options: "long" }),
            }
        );

        if (!postmarkResponse.ok) {
            throw new Error(`Postmark API error: ${postmarkResponse.status}`);
        }

        const postmarkData = await postmarkResponse.json();

        if (!postmarkData.success) {
            throw new Error("Postmark returned an unsuccessful response");
        }

        const { score, thresholds, report } = parsePostmarkResponse(postmarkData);
        const { riskLevel, riskPercent } = getRiskLevel(score);

        const result: SpamCheckResult = {
            score,
            thresholds,
            isSpam: score >= 5,
            report,
            riskLevel,
            riskPercent,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Spam check error:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to check spam score. Please try again.",
            },
            { status: 500 }
        );
    }
}