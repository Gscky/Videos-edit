import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type Segment = {
  file: string;
  frames: number;
  label: string | null;
};

// Un día en mi vida — sábado 5 de julio, ordenado por hora de grabación.
export const SEGMENTS: Segment[] = [
  { file: "segments/seg01.mp4", frames: 41, label: "9:59 AM" },
  { file: "segments/seg02.mp4", frames: 68, label: "10:16 AM" },
  { file: "segments/seg03.mp4", frames: 75, label: null },
  { file: "segments/seg04.mp4", frames: 75, label: "10:28 AM" },
  { file: "segments/seg05.mp4", frames: 90, label: "10:43 AM" },
  { file: "segments/seg06.mp4", frames: 90, label: null },
  { file: "segments/seg07.mp4", frames: 90, label: "10:57 AM" },
  { file: "segments/seg08.mp4", frames: 107, label: "11:17 AM" },
  { file: "segments/seg09.mp4", frames: 120, label: "11:23 AM" },
  { file: "segments/seg10.mp4", frames: 107, label: "11:32 AM" },
  { file: "segments/seg11.mp4", frames: 90, label: "11:48 AM" },
  { file: "segments/seg12.mp4", frames: 90, label: "11:54 AM" },
  { file: "segments/seg13.mp4", frames: 90, label: null },
  { file: "segments/seg14.mp4", frames: 90, label: null },
  { file: "segments/seg15.mp4", frames: 72, label: "12:06 PM" },
  { file: "segments/seg16.mp4", frames: 87, label: null },
  { file: "segments/seg17.mp4", frames: 105, label: "1:37 PM" },
  { file: "segments/seg18.mp4", frames: 120, label: "6:26 PM" },
  { file: "segments/seg19.mp4", frames: 120, label: "7:56 PM" },
  { file: "segments/seg20.mp4", frames: 95, label: "9:25 PM" },
  { file: "segments/seg21.mp4", frames: 87, label: "9:37 PM" },
  { file: "segments/seg22.mp4", frames: 90, label: "12:00 AM" },
  { file: "segments/seg23.mp4", frames: 90, label: "12:37 AM" },
  { file: "segments/seg24.mp4", frames: 120, label: "12:55 AM" },
  { file: "segments/seg25.mp4", frames: 150, label: null },
];

export const TOTAL_FRAMES = SEGMENTS.reduce((acc, s) => acc + s.frames, 0);

const FONT = "SF Pro Display, SF Pro Text, Helvetica, Arial, sans-serif";

const TimeChip: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 0 220px 60px",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "bottom left",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
          fontFamily: FONT,
          fontSize: 46,
          fontWeight: 600,
          letterSpacing: 1,
          padding: "16px 36px",
          borderRadius: 999,
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 16 } });
  const out = interpolate(frame, [85, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - appear) * 40}px)`,
          opacity: appear,
          textAlign: "center",
          color: "white",
          fontFamily: FONT,
          textShadow: "0 4px 30px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2 }}>
          un día en mi vida
        </div>
        <div style={{ fontSize: 42, fontWeight: 500, marginTop: 18, opacity: 0.9 }}>
          sábado · 5 de julio
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${appear})`,
          color: "white",
          fontFamily: FONT,
          fontSize: 72,
          fontWeight: 800,
          textShadow: "0 4px 30px rgba(0,0,0,0.8)",
        }}
      >
        buenas noches ✌️
      </div>
    </AbsoluteFill>
  );
};

export const DayInLife: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {SEGMENTS.map((s, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={s.frames}>
            <OffthreadVideo src={staticFile(s.file)} volume={0.85} />
            {s.label ? <TimeChip label={s.label} /> : null}
          </Sequence>
        );
        from += s.frames;
        return el;
      })}
      <Sequence durationInFrames={110}>
        <Intro />
      </Sequence>
      <Sequence from={TOTAL_FRAMES - 85}>
        <Outro />
      </Sequence>
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: 1 - Math.min(fadeIn, fadeOut),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
