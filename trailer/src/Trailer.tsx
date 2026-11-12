import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { baloo, body, display } from "./fonts";

const NIGHT = "#12172b";
const EMBER = "#f5a524";
const CREAM = "#f3efe6";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring from 0 to 1 that starts at `delay` frames. */
const useRise = (delay: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });
};

const Rise: React.FC<{ delay: number; children: React.ReactNode; y?: number; style?: React.CSSProperties }> = ({
  delay,
  children,
  y = 44,
  style,
}) => {
  const s = useRise(delay);
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * y}px)`, ...style }}>{children}</div>;
};

/** Headline whose words rise in one after another. */
const Words: React.FC<{ text: string; delay: number; style: React.CSSProperties; step?: number }> = ({
  text,
  delay,
  style,
  step = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.26em", ...style }}>
      {text.split(" ").map((word, i) => {
        const s = spring({ frame: frame - delay - i * step, fps, config: { damping: 14, mass: 0.6 } });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - s) * 110}%)` }}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};

type Shot = { src: string; from: number; pan?: number };

/** A browser window that cuts between app screens, each drifting slowly upward. */
const Browser: React.FC<{ shots: Shot[]; delay: number; bar: string; dot: string; shadow: string }> = ({
  shots,
  delay,
  bar,
  dot,
  shadow,
}) => {
  const frame = useCurrentFrame();
  const enter = useRise(delay, 18);
  const float = Math.sin(frame / 38) * 6;
  const W = 1060;
  const H = 662;
  return (
    <div
      style={{
        width: W,
        height: H + 46,
        borderRadius: 26,
        overflow: "hidden",
        background: bar,
        boxShadow: `0 60px 120px ${shadow}, 0 10px 30px ${shadow}`,
        opacity: enter,
        transform: `perspective(2200px) rotateY(${-11 + enter * 3}deg) rotateX(${3 - enter}deg) translateY(${
          (1 - enter) * 160 + float
        }px) translateX(${(1 - enter) * 120}px)`,
        transformOrigin: "left center",
      }}
    >
      <div style={{ height: 46, display: "flex", alignItems: "center", gap: 10, paddingLeft: 22 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: dot }} />
        ))}
      </div>
      <div style={{ position: "relative", width: W, height: H, overflow: "hidden", background: "#fff" }}>
        {shots.map((shot, i) => {
          const local = frame - shot.from;
          const next = shots[i + 1]?.from ?? Infinity;
          if (local < 0 || frame > next + 12) return null;
          const inS = interpolate(local, [0, 12], [0, 1], clamp);
          const pan = interpolate(local, [0, 90], [0, shot.pan ?? 26], clamp);
          return (
            <Img
              key={shot.src}
              src={staticFile(shot.src)}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                opacity: i === 0 ? 1 : inS,
                transform: `translateY(${(1 - inS) * (i === 0 ? 0 : 40) - pan}px) scale(${1 + local * 0.00022})`,
                transformOrigin: "top center",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const Chips: React.FC<{ items: string[]; delay: number; bg: string; color: string; border?: string }> = ({
  items,
  delay,
  bg,
  color,
  border,
}) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
    {items.map((item, i) => (
      <Rise key={item} delay={delay + i * 5} y={26}>
        <div
          style={{
            fontFamily: body,
            fontWeight: 700,
            fontSize: 30,
            padding: "14px 28px",
            borderRadius: 40,
            background: bg,
            color,
            border: border ? `3px solid ${border}` : undefined,
          }}
        >
          {item}
        </div>
      </Rise>
    ))}
  </div>
);

/** A solid panel that sweeps across to hide the cut between scenes. */
const Wipe: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 12, at, at + 12], [-100, 0, 100], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  if (frame < at - 12 || frame > at + 12) return null;
  return <AbsoluteFill style={{ background: color, transform: `translateX(${t}%)` }} />;
};

const AppScene: React.FC<{
  bg: string;
  ink: string;
  soft: string;
  accent: string;
  number: string;
  title: string;
  titleFont: string;
  extra?: React.ReactNode;
  line: string;
  chips: string[];
  chipBg: string;
  chipColor: string;
  chipBorder?: string;
  shots: Shot[];
  bar: string;
  dot: string;
  shadow: string;
  deco?: React.ReactNode;
}> = (p) => (
  <AbsoluteFill style={{ background: p.bg }}>
    {p.deco}
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 0 0 110px", gap: 70 }}>
      <div style={{ width: 640, flexShrink: 0, display: "flex", flexDirection: "column", gap: 26 }}>
        <Rise delay={6} y={20}>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 26, letterSpacing: "0.16em", color: p.accent }}>
            {p.number}
          </div>
        </Rise>
        <Words
          text={p.title}
          delay={10}
          style={{ fontFamily: p.titleFont, fontWeight: 700, fontSize: 104, lineHeight: 1, letterSpacing: "-0.02em", color: p.ink }}
        />
        {p.extra}
        <Rise delay={30}>
          <div style={{ fontFamily: body, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: p.soft }}>{p.line}</div>
        </Rise>
        <Chips items={p.chips} delay={46} bg={p.chipBg} color={p.chipColor} border={p.chipBorder} />
      </div>
      <Browser shots={p.shots} delay={16} bar={p.bar} dot={p.dot} shadow={p.shadow} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Stars: React.FC<{ color: string; count?: number }> = ({ color, count = 46 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => {
        const x = (i * 397) % 1920;
        const y = (i * 251) % 1080;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 22 + i));
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: i % 3 ? 5 : 8, height: i % 3 ? 5 : 8, borderRadius: 4, background: color, opacity: tw }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const sun = useRise(0, 20);
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      <Stars color="#dfe9f2" />
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 260,
          width: 560,
          height: 560,
          borderRadius: 280,
          background: "#2a2f5c",
          transform: `scale(${0.6 + sun * 0.4})`,
        }}
      >
        <div style={{ position: "absolute", inset: 80, borderRadius: 200, background: "#7a4a3a" }} />
        <div style={{ position: "absolute", inset: 150, borderRadius: 130, background: EMBER, transform: `scale(${1 + Math.sin(frame / 14) * 0.03})` }} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 130px", gap: 30 }}>
        <Rise delay={4} y={20}>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 30, letterSpacing: "0.16em", color: EMBER }}>
            IT STARTED WITH A QUESTION
          </div>
        </Rise>
        <Words
          text="How do I make new things approachable?"
          delay={8}
          step={4}
          style={{ fontFamily: display, fontWeight: 700, fontSize: 128, lineHeight: 1, letterSpacing: "-0.03em", color: CREAM, maxWidth: 1120 }}
        />
        <Rise delay={46}>
          <div style={{ fontFamily: body, fontWeight: 500, fontSize: 46, color: "#c9cfe3" }}>For my daughter. And for me.</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The problem behind an app, shown full screen before the app itself. */
const Question: React.FC<{
  bg: string;
  ink: string;
  accent: string;
  who: string;
  text: string;
  font: string;
  deco?: React.ReactNode;
}> = ({ bg, ink, accent, who, text, font, deco }) => (
  <AbsoluteFill style={{ background: bg }}>
    {deco}
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 150px", gap: 34 }}>
      <Rise delay={2} y={20}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 32, letterSpacing: "0.16em", color: accent }}>{who}</div>
      </Rise>
      <Words
        text={text}
        delay={6}
        step={2}
        style={{ fontFamily: font, fontWeight: 700, fontSize: 108, lineHeight: 1.06, letterSpacing: "-0.02em", color: ink, maxWidth: 1560 }}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const cards = [
    { src: "wonder-1.png", name: "Riya's Wonder Lab", path: "/wonder" },
    { src: "ram-1.png", name: "Riya's Ramayana", path: "/ramayana" },
    { src: "ayu-cold.png", name: "Ayu", path: "/ayu" },
  ];
  return (
    <AbsoluteFill style={{ background: NIGHT, alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Stars color="#dfe9f2" count={30} />
      <Words
        text="AI made building them approachable too."
        delay={6}
        style={{ fontFamily: display, fontWeight: 700, fontSize: 88, letterSpacing: "-0.02em", color: CREAM, justifyContent: "center" }}
      />
      <Rise delay={30} y={20}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 40, color: EMBER }}>Built with Codex and Claude</div>
      </Rise>
      <div style={{ display: "flex", gap: 40, marginTop: 16 }}>
        {cards.map((c, i) => (
          <Rise key={c.path} delay={52 + i * 6} y={70}>
            <div style={{ width: 470, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ height: 294, borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.5)" }}>
                <Img src={staticFile(c.src)} style={{ width: 470 }} />
              </div>
              <div style={{ fontFamily: body, fontWeight: 700, fontSize: 32, color: CREAM }}>{c.name}</div>
              <div style={{ fontFamily: body, fontWeight: 500, fontSize: 28, color: "#c9cfe3", marginTop: -8 }}>
                vaishalimittal.com<span style={{ color: EMBER, fontWeight: 700 }}>{c.path}</span>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Q = 90; // frames a question stays on screen
const A = 126; // frames an app stays on screen
const INTRO = 96;
const PART = Q + A;

const wonderDeco = (
  <>
    <div style={{ position: "absolute", left: -140, bottom: -160, width: 520, height: 520, borderRadius: 260, background: "#ffd84f", opacity: 0.55 }} />
    <div style={{ position: "absolute", right: -100, top: -120, width: 380, height: 380, borderRadius: 190, background: "#c9d2ec", opacity: 0.6 }} />
  </>
);
const ramDeco = (
  <>
    <div style={{ position: "absolute", left: -120, top: -140, width: 440, height: 440, borderRadius: 220, background: "#fff1c4" }} />
    <div style={{ position: "absolute", right: -160, bottom: -200, width: 560, height: 560, borderRadius: 280, background: "#bcd9d5", opacity: 0.7 }} />
  </>
);

export const Trailer: React.FC = () => (
  <AbsoluteFill style={{ background: NIGHT }}>
    <Sequence durationInFrames={INTRO}>
      <Intro />
    </Sequence>

    <Sequence from={INTRO} durationInFrames={Q}>
      <Question
        bg="#f7f9fe"
        ink="#23305e"
        accent="#c98f00"
        who="FOR MY DAUGHTER"
        text="How do we learn together what she's learning at school?"
        font={baloo}
        deco={wonderDeco}
      />
    </Sequence>
    <Sequence from={INTRO + Q} durationInFrames={A}>
      <AppScene
        bg="#f7f9fe"
        ink="#23305e"
        soft="#5d6890"
        accent="#c98f00"
        number="SO I BUILT"
        title="Riya's Wonder Lab"
        titleFont={baloo}
        line="Science and number lessons we do side by side."
        chips={["Space", "My Body", "Number games"]}
        chipBg="#ffd84f"
        chipColor="#23305e"
        shots={[
          { src: "wonder-1.png", from: 0 },
          { src: "wonder-3.png", from: 44 },
          { src: "wonder-4.png", from: 86 },
        ]}
        bar="#23305e"
        dot="#ffd84f"
        shadow="rgba(35,48,94,.28)"
        deco={wonderDeco}
      />
    </Sequence>

    <Sequence from={INTRO + PART} durationInFrames={Q}>
      <Question
        bg="#eaf5f3"
        ink="#1f2352"
        accent="#0f7c82"
        who="FOR OUR CULTURE"
        text="She saw a Ramayana play. Now she keeps asking why."
        font={baloo}
        deco={ramDeco}
      />
    </Sequence>
    <Sequence from={INTRO + PART + Q} durationInFrames={A}>
      <AppScene
        bg="#eaf5f3"
        ink="#1f2352"
        soft="#565b86"
        accent="#0f7c82"
        number="SO I BUILT"
        title="Riya's Ramayana"
        titleFont={baloo}
        extra={
          <Rise delay={24} y={20}>
            <div style={{ fontFamily: baloo, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: "#d7372f", marginTop: -14 }}>राम की कहानी</div>
          </Rise>
        }
        line="The story behind what we celebrate, and why."
        chips={["Nine chapters", "Read aloud", "Hindi names"]}
        chipBg="#f5a623"
        chipColor="#1f2352"
        shots={[
          { src: "ram-1.png", from: 0 },
          { src: "ram-3.png", from: 38, pan: 60 },
          { src: "ram-4.png", from: 68, pan: 60 },
          { src: "ram-5.png", from: 98 },
        ]}
        bar="#1f2352"
        dot="#f5a623"
        shadow="rgba(31,35,82,.26)"
        deco={ramDeco}
      />
    </Sequence>

    <Sequence from={INTRO + PART * 2} durationInFrames={Q}>
      <Question
        bg={NIGHT}
        ink={CREAM}
        accent={EMBER}
        who="FOR ME"
        text="When we're sick, my mom says ginger, lemon and cloves. I wanted to know why."
        font={display}
        deco={<Stars color="#dfe9f2" count={34} />}
      />
    </Sequence>
    <Sequence from={INTRO + PART * 2 + Q} durationInFrames={A}>
      <AppScene
        bg={NIGHT}
        ink={CREAM}
        soft="#c9cfe3"
        accent={EMBER}
        number="SO I BUILT"
        title="Ayu"
        titleFont={display}
        line="Ayurveda I can understand and use."
        chips={["Hot", "Cold", "Dry & windy", "Wet & damp"]}
        chipBg="transparent"
        chipColor={CREAM}
        chipBorder="#343d66"
        shots={[
          { src: "ayu-hot.png", from: 0, pan: 0 },
          { src: "ayu-cold.png", from: 26, pan: 0 },
          { src: "ayu-wet.png", from: 48, pan: 0 },
          { src: "ayu-practices.png", from: 70 },
          { src: "ayu-coldflu.png", from: 98 },
        ]}
        bar="#262e52"
        dot={EMBER}
        shadow="rgba(0,0,0,.55)"
        deco={<Stars color="#dfe9f2" count={34} />}
      />
    </Sequence>

    <Sequence from={INTRO + PART * 3} durationInFrames={900 - INTRO - PART * 3}>
      <Outro />
    </Sequence>

    <Wipe at={INTRO} color="#ffd84f" />
    <Wipe at={INTRO + PART} color="#f5a623" />
    <Wipe at={INTRO + PART * 2} color="#1c2340" />
    <Wipe at={INTRO + PART * 3} color={EMBER} />
  </AbsoluteFill>
);
