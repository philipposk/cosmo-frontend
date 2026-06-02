"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";

type Palette = "ivory" | "bone" | "paper" | "midnight";
type Accent = "persimmon" | "forest" | "plum" | "ink";
type Font = "instrument" | "newsreader" | "geist";
type Density = "comfortable" | "compact";

type Tweaks = {
  palette: Palette;
  accent: Accent;
  font: Font;
  density: Density;
};

const DEFAULTS: Tweaks = {
  palette: "ivory",
  accent: "persimmon",
  font: "instrument",
  density: "comfortable",
};

const STORAGE_KEY = "cosmo.tweaks.v1";

const PALETTE_MAP: Record<
  Palette,
  {
    bg: string;
    surface: string;
    surface2: string;
    surface3: string;
    ink: string;
    ink2: string;
    mute: string;
    line: string;
    lineSoft: string;
    faint: string;
  }
> = {
  ivory: {
    bg: "#F6F2EA",
    surface: "#FFFFFF",
    surface2: "#FBF7EE",
    surface3: "#F0EBE0",
    ink: "#14110D",
    ink2: "#2C261E",
    mute: "#6B6357",
    line: "#E6DFCC",
    lineSoft: "#EFE9D9",
    faint: "#C5BDAD",
  },
  bone: {
    bg: "#EEEAE2",
    surface: "#F8F5ED",
    surface2: "#F3EFE5",
    surface3: "#E5DFD0",
    ink: "#1A1610",
    ink2: "#332B20",
    mute: "#6B6357",
    line: "#DCD4BF",
    lineSoft: "#E6DFCC",
    faint: "#BFB8A8",
  },
  paper: {
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surface2: "#F7F5F1",
    surface3: "#EFEDE6",
    ink: "#1A1814",
    ink2: "#36322A",
    mute: "#6E6A60",
    line: "#EAE7DE",
    lineSoft: "#F2EFE8",
    faint: "#C5BFB1",
  },
  midnight: {
    bg: "#15130E",
    surface: "#1E1A14",
    surface2: "#231F18",
    surface3: "#2A251D",
    ink: "#F4EFE2",
    ink2: "#E8E0CD",
    mute: "#A39B85",
    line: "#312B22",
    lineSoft: "#272218",
    faint: "#5C5444",
  },
};

const ACCENT_MAP: Record<Accent, { accent: string; accentInk: string; accentSoft: string }> = {
  persimmon: { accent: "#C44E2C", accentInk: "#8E2F14", accentSoft: "#F8E8DF" },
  forest: { accent: "#2D4F44", accentInk: "#1A3128", accentSoft: "#DCE9DF" },
  plum: { accent: "#5B3A6B", accentInk: "#3D2348", accentSoft: "#ECE2F1" },
  ink: { accent: "#14110D", accentInk: "#000000", accentSoft: "#E6DFCC" },
};

const FONT_VAR: Record<Font, string> = {
  instrument: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
  newsreader: 'var(--font-newsreader), "Newsreader", Georgia, serif',
  geist: 'var(--font-geist-sans), "Geist", -apple-system, sans-serif',
};

function apply(t: Tweaks) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const p = PALETTE_MAP[t.palette];
  const a = ACCENT_MAP[t.accent];
  r.style.setProperty("--bg", p.bg);
  r.style.setProperty("--surface", p.surface);
  r.style.setProperty("--surface-2", p.surface2);
  r.style.setProperty("--surface-3", p.surface3);
  r.style.setProperty("--ink", p.ink);
  r.style.setProperty("--ink-2", p.ink2);
  r.style.setProperty("--mute", p.mute);
  r.style.setProperty("--line", p.line);
  r.style.setProperty("--line-soft", p.lineSoft);
  r.style.setProperty("--faint", p.faint);
  r.style.setProperty("--accent", a.accent);
  r.style.setProperty("--accent-ink", a.accentInk);
  r.style.setProperty("--accent-soft", a.accentSoft);
  r.style.setProperty("--display", FONT_VAR[t.font]);
  if (t.density === "compact") {
    r.style.setProperty("--t-1", "12px");
    r.style.setProperty("--t-2", "13px");
    r.style.setProperty("--t-3", "14px");
    r.style.setProperty("--t-4", "15px");
  } else {
    r.style.setProperty("--t-1", "13px");
    r.style.setProperty("--t-2", "14px");
    r.style.setProperty("--t-3", "15px");
    r.style.setProperty("--t-4", "17px");
  }
}

function load(): Tweaks {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Tweaks>) };
  } catch {
    return DEFAULTS;
  }
}

function Row<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <>
      <div className="tweak-section">{label}</div>
      <div className="tweak-radio">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={"tweak-opt" + (opt === value ? " active" : "")}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
}

function useTweaksState(): [Tweaks, (next: Tweaks) => void] {
  // Lazy initializer reads localStorage only on the client. SSR returns
  // DEFAULTS; the first client render swaps to stored values inside the same
  // commit, so there is no setState-in-effect cascade.
  const [tweaks, setTweaks] = useState<Tweaks>(() => load());

  useEffect(() => {
    apply(tweaks);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
    } catch {
      // ignore storage write failures
    }
  }, [tweaks]);

  return [tweaks, setTweaks];
}

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [tweaks, setTweaks] = useTweaksState();

  function set<K extends keyof Tweaks>(key: K, value: Tweaks[K]) {
    setTweaks({ ...tweaks, [key]: value });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tweak-collapse"
        style={{ position: "fixed", bottom: 22, right: 22, zIndex: 50 }}
        aria-label="Open theme tweaks"
        title="Theme tweaks"
      >
        <Icon name="palette" size={16} />
      </button>
    );
  }

  return (
    <div className="tweaks" role="dialog" aria-label="Theme tweaks">
      <div className="tweaks-head">
        <h4>Tweaks</h4>
        <button type="button" onClick={() => setOpen(false)} className="tweak-collapse" aria-label="Close">
          <Icon name="check" size={14} />
        </button>
      </div>
      <Row<Palette>
        label="Surface"
        value={tweaks.palette}
        options={["ivory", "bone", "paper", "midnight"] as const}
        onChange={(v) => set("palette", v)}
      />
      <Row<Accent>
        label="Accent"
        value={tweaks.accent}
        options={["persimmon", "forest", "plum", "ink"] as const}
        onChange={(v) => set("accent", v)}
      />
      <Row<Font>
        label="Display font"
        value={tweaks.font}
        options={["instrument", "newsreader", "geist"] as const}
        onChange={(v) => set("font", v)}
      />
      <Row<Density>
        label="Density"
        value={tweaks.density}
        options={["comfortable", "compact"] as const}
        onChange={(v) => set("density", v)}
      />
    </div>
  );
}

export default TweaksPanel;
