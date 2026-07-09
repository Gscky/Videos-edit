import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type Segment = {
  file: string;
  frames: number;
};

// Un día en mi vida — sábado 5 de julio, ordenado por hora de grabación.
// Versión sin textos: solo los cortes y fundidos de entrada/salida.
export const SEGMENTS: Segment[] = [
  { file: "segments/seg01.mp4", frames: 41 },
  { file: "segments/seg02.mp4", frames: 68 },
  { file: "segments/seg03.mp4", frames: 75 },
  { file: "segments/seg04.mp4", frames: 75 },
  { file: "segments/seg05.mp4", frames: 90 },
  { file: "segments/seg06.mp4", frames: 90 },
  { file: "segments/seg07.mp4", frames: 90 },
  { file: "segments/seg08.mp4", frames: 107 },
  { file: "segments/seg09.mp4", frames: 120 },
  { file: "segments/seg10.mp4", frames: 107 },
  { file: "segments/seg11.mp4", frames: 90 },
  { file: "segments/seg12.mp4", frames: 90 },
  { file: "segments/seg13.mp4", frames: 90 },
  { file: "segments/seg14.mp4", frames: 90 },
  { file: "segments/seg15.mp4", frames: 72 },
  { file: "segments/seg16.mp4", frames: 87 },
  { file: "segments/seg17.mp4", frames: 105 },
  { file: "segments/seg18.mp4", frames: 120 },
  { file: "segments/seg19.mp4", frames: 120 },
  { file: "segments/seg20.mp4", frames: 95 },
  { file: "segments/seg21.mp4", frames: 87 },
  { file: "segments/seg22.mp4", frames: 90 },
  { file: "segments/seg23.mp4", frames: 90 },
  { file: "segments/seg24.mp4", frames: 120 },
  { file: "segments/seg25.mp4", frames: 150 },
];

export const TOTAL_FRAMES = SEGMENTS.reduce((acc, s) => acc + s.frames, 0);

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
            <OffthreadVideo src={staticFile(s.file)} muted />
          </Sequence>
        );
        from += s.frames;
        return el;
      })}
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
