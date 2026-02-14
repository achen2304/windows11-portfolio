"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { themes } from "@/lib/themes";
import { SlackTheme } from "@/components/types/system-types";
import WelcomeBanner from "../common/WelcomeBanner";
import ProfileImage from "../common/ProfileImage";
import { ExternalLink } from "lucide-react";

interface Reflection {
  title: string;
  fileName: string;
  driveLink: string;
}

const REFLECTIONS: Reflection[] = [
  {
    title: "General Reflection",
    fileName: "general.pdf",
    driveLink: "https://drive.google.com/file/d/1M7hh4yf6RN353AuvAr2CHvebNGeAMO0_/view?usp=sharing",
  },
  {
    title: "Ethics Reflection",
    fileName: "ethics.pdf",
    driveLink: "https://drive.google.com/file/d/1_-RcDdupWV-VPUiFiiKKYAJd6kV46V-Z/view?usp=sharing",
  },
  {
    title: "Cumulative Reflection",
    fileName: "cumulative.pdf",
    driveLink: "https://drive.google.com/file/d/1ZKmX35HKafVGM8oLBaKtVaiST59NP4RJ/view?usp=sharing",
  },
];

const PdfPreview = ({ reflection, slackTheme }: { reflection: Reflection; slackTheme: SlackTheme }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="rounded-md overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
      style={{
        background: slackTheme.threadBackground,
        border: `1px solid ${slackTheme.divider}`,
      }}
    >
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${slackTheme.divider}` }}>
        <span className="text-sm font-bold" style={{ color: slackTheme.textPrimary }}>
          {reflection.title}
        </span>
        <a href={reflection.driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity" style={{ color: slackTheme.accent }}>
          <span>Open in Drive</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="w-full" style={{ background: slackTheme.messageBackground }}>
        {!hasError ? (
          <iframe src={`/pdfs/${reflection.fileName}`} className="w-full border-0" style={{ height: "500px" }} title={reflection.title} onError={() => setHasError(true)} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: slackTheme.textSecondary }}>
            <p className="text-sm mb-2">Unable to preview PDF</p>
            <a href={reflection.driveLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1" style={{ color: slackTheme.accent }}>
              View on Google Drive <ExternalLink size={12} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const ReflectionsChannel: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div className="p-4">
      <WelcomeBanner title="Reflections" description="A collection of my reflections throughout my journey. Click 'Open in Drive' to download or view the full document." slackTheme={slackTheme} />

      <div className="space-y-4 mb-6">
        <div
          className="p-2 pb-3 flex items-start rounded-sm"
          onMouseOver={(e) => {
            e.currentTarget.style.background = slackTheme.messageBackground;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ProfileImage src="/other/profile.webp" alt="Cai Chen" />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-bold text-md" style={{ color: slackTheme.textPrimary }}>
                Cai Chen
              </span>
              <span className="ml-2 text-xs" style={{ color: slackTheme.textSecondary }}>
                2:00 PM
              </span>
            </div>

            <div className="text-sm mt-1 mb-4" style={{ color: slackTheme.textPrimary }}>
              Here are some of my reflections:
            </div>

            <div className="space-y-4">
              {REFLECTIONS.map((reflection) => (
                <PdfPreview key={reflection.fileName} reflection={reflection} slackTheme={slackTheme} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionsChannel;
