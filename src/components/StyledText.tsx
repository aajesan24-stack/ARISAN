import React from 'react';

interface StyledTextProps {
  text?: string;
  defaultColor?: string;
}

export const StyledText: React.FC<StyledTextProps> = ({ text, defaultColor }) => {
  if (!text) return null;

  // Pattern matches:
  // [color=#hex]text[/color]
  // [*text*] (brand dynamic color)
  // [highlight]text[/highlight]
  // **bold**
  const regex = /(\[color=(#[a-fA-F0-9]{3,8})\](.*?)\[\/color\])|(\[\*(.*?)\*\])|(\[highlight\](.*?)\[\/highlight\])|(\*\*(.*?)\*\*)/g;
  const parts: React.ReactNode[] = [];
  
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Add text segment before matched group
    if (matchIndex > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, matchIndex)}</span>);
    }

    if (match[1]) {
      // [color=#hex]text[/color]
      const hexColor = match[2];
      const content = match[3];
      parts.push(
        <span key={`color-${matchIndex}`} style={{ color: hexColor }}>
          {content}
        </span>
      );
    } else if (match[4]) {
      // [*text*] (special highlighted accent using the current theme button background color!)
      const content = match[5];
      parts.push(
        <span key={`brand-${matchIndex}`} className="text-[var(--theme-button-bg)] font-bold">
          {content}
        </span>
      );
    } else if (match[6]) {
      // [highlight]text[/highlight]
      const content = match[7];
      parts.push(
        <span key={`highlight-${matchIndex}`} className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-700 border border-amber-200/20 shadow-sm mx-1">
          {content}
        </span>
      );
    } else if (match[8]) {
      // **bold**
      const content = match[9];
      parts.push(
        <strong key={`bold-${matchIndex}`} className="font-extrabold text-stone-100">
          {content}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-end`}>{text.substring(lastIndex)}</span>);
  }

  if (parts.length === 0) {
    return <span style={{ color: defaultColor }}>{text}</span>;
  }

  return <span style={{ color: defaultColor }}>{parts}</span>;
};
