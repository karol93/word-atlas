import { Download, RotateCcw, Upload } from "lucide-react";
import { useMemo, useRef } from "react";
import { useAtlas } from "../atlas/context";
import { plural } from "../lib/pl";
import { isMastered } from "../store/srs";
import { dayKey, exportBackup, importBackup, resetProgress, store, useStore, type Settings } from "../store/store";
import { toast } from "../ui/Toast";
import { streakOf } from "./Today";

export function Me({ privateAvailable }: { privateAvailable: boolean }) {
  const atlas = useAtlas();
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const saveError = useStore((s) => s.saveError);
  const file = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const cards = Object.values(progress.cards);
    const days = Object.values(progress.days);
    const r = days.reduce((n, d) => n + d.r, 0);
    const c = days.reduce((n, d) => n + d.c, 0);
    const t = days.reduce((n, d) => n + d.t, 0);
    const now = Date.now();
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      end.setDate(end.getDate() + i);
      const start = new Date(end);
      start.setHours(0, 0, 0, 0);
      return cards.filter((x) => (i === 0 ? x.due <= end.getTime() : x.due >= start.getTime() && x.due <= end.getTime())).length;
    });
    void now;
    return { learned: cards.length, mastered: cards.filter(isMastered).length, reviews: r, accuracy: r ? Math.round((c / r) * 100) : 0, minutes: Math.round(t / 60), forecast };
  }, [progress]);

  const set = (patch: Partial<Settings>) => store.settings(patch);
  const download = () => {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `word-atlas-backup-${dayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const restore = async (f: File) => {
    if (f.size > 30 * 1024 * 1024) return toast("Plik jest za duży, to raczej nie jest kopia zapasowa nauki.", "warn");
    const r = importBackup(await f.text());
    toast(r.ok ? `Przywrócono postęp: ${r.cards} ${plural(r.cards, "słowo", "słowa", "słów")}` : r.error, r.ok ? "ok" : "warn");
  };
  const maxF = Math.max(1, ...stats.forecast);

  return (
    <div className="page me">
      <header className="page-head">
        <p className="eyebrow">Ja</p>
        <h1 className="display">Twoje niebo</h1>
      </header>

      <section className="stat-strip">
        <div>
          <dt>Seria dni</dt>
          <dd>
            {streakOf(progress.days)}
            <small>{plural(streakOf(progress.days), "dzień", "dni", "dni")}</small>
          </dd>
        </div>
        <div>
          <dt>Rozświetlone</dt>
          <dd>{stats.learned.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Zapamiętane na stałe</dt>
          <dd>{stats.mastered.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Skuteczność za 1. razem</dt>
          <dd>
            {stats.accuracy}
            <small>%</small>
          </dd>
        </div>
        <div>
          <dt>Czas nauki</dt>
          <dd>
            {stats.minutes}
            <small>min</small>
          </dd>
        </div>
      </section>

      <div className="me-grid">
        <section className="panel">
          <h3 className="eyebrow">Ostatnie 20 tygodni</h3>
          <Heatmap days={progress.days} />
          <p className="muted">Jedno pole to jeden dzień, im ciemniejsze, tym więcej odpowiedzi. „Zapamiętane na stałe” oznacza stabilność pamięci powyżej 21 dni.</p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">Powtórki w ciągu 7 dni</h3>
          <ol className="forecast">
            {stats.forecast.map((n, i) => (
              <li key={i}>
                <span style={{ height: `${(n / maxF) * 100}%` }} />
                <b>{n}</b>
                <small>{i === 0 ? "Dziś" : i === 1 ? "Jutro" : `+${i}`}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel settings">
          <h3 className="eyebrow">Ustawienia nauki</h3>
          <Field label="Nowe słowa dziennie" hint="Powtórki nie mają limitu, algorytm planuje tylko słowa bliskie zapomnienia.">
            <div className="segmented">
              {[5, 10, 15, 20, 30].map((n) => (
                <button key={n} className={settings.dailyNew === n ? "is-on" : ""} onClick={() => set({ dailyNew: n })}>
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Poziom startowy" hint="Pomiń niższe poziomy, które już znasz.">
            <div className="segmented">
              {atlas.cefr.map((l, i) => (
                <button key={l} className={settings.startLevel === i ? "is-on" : ""} onClick={() => set({ startLevel: i })}>
                  {l}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Docelowa skuteczność pamięci" hint="Im wyżej, tym częstsze powtórki. 90% to dobry wybór dla większości osób.">
            <div className="segmented">
              {[0.85, 0.9, 0.95].map((n) => (
                <button key={n} className={settings.retention === n ? "is-on" : ""} onClick={() => set({ retention: n })}>
                  {Math.round(n * 100)}%
                </button>
              ))}
            </div>
          </Field>
          <Field label="Wymowa">
            <div className="segmented">
              <button className={settings.accent === "uk" ? "is-on" : ""} onClick={() => set({ accent: "uk" })}>
                Brytyjska
              </button>
              <button className={settings.accent === "us" ? "is-on" : ""} onClick={() => set({ accent: "us" })}>
                Amerykańska
              </button>
            </div>
          </Field>
          <Field label="Wygląd">
            <div className="segmented">
              {(
                [
                  ["system", "Jak w systemie"],
                  ["light", "Jasny"],
                  ["dark", "Ciemny"],
                ] as const
              ).map(([k, l]) => (
                <button key={k} className={settings.theme === k ? "is-on" : ""} onClick={() => set({ theme: k })}>
                  {l}
                </button>
              ))}
            </div>
          </Field>
          <Toggle label="Odtwarzaj wymowę automatycznie" on={settings.autoplay} set={(v) => set({ autoplay: v })} />
          <Toggle label="Dźwięki interfejsu" on={settings.sfx} set={(v) => set({ sfx: v })} />
          <Toggle label="Animacja startowa (raz dziennie)" on={settings.splash} set={(v) => set({ splash: v })} />
          <Toggle label="Zadania z pisownią w powtórkach" on={settings.spell} set={(v) => set({ spell: v })} />
          {privateAvailable && (
            <Field label="Zestaw słówek" hint="Prywatny zestaw jest dostępny tylko na lokalnym serwerze deweloperskim i nie trafia do publikacji.">
              <div className="segmented">
                <button className={settings.dataset === "open" ? "is-on" : ""} onClick={() => set({ dataset: "open" })}>
                  Otwarty atlas
                </button>
                <button className={settings.dataset === "private" ? "is-on" : ""} onClick={() => set({ dataset: "private" })}>
                  Prywatny zestaw
                </button>
              </div>
            </Field>
          )}
        </section>

        <section className="panel">
          <h3 className="eyebrow">Dane</h3>
          <p className="muted">Postęp jest zapisany tylko w przeglądarce na tym urządzeniu: bez konta i bez serwera. Przy zmianie urządzenia wyeksportuj kopię i zaimportuj ją na nowym.</p>
          {saveError && <p className="warn-text">Przeglądarka odmówiła zapisu (tryb prywatny lub brak miejsca). Jak najszybciej wyeksportuj kopię zapasową.</p>}
          <div className="data-actions">
            <button className="btn btn-ghost" onClick={download}>
              <Download size={18} /> Eksportuj kopię
            </button>
            <button className="btn btn-ghost" onClick={() => file.current?.click()}>
              <Upload size={18} /> Importuj kopię
            </button>
            <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && restore(e.target.files[0]).finally(() => (e.target.value = ""))} />
            <button
              className="btn btn-ghost btn-danger"
              onClick={() => {
                if (confirm("Wyczyścić cały postęp w tym zestawie? Tej operacji nie można cofnąć, najpierw warto wyeksportować kopię.")) {
                  resetProgress();
                  toast("Postęp został wyczyszczony");
                }
              }}
            >
              <RotateCcw size={18} /> Wyczyść postęp
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <div>
        <b>{label}</b>
        {hint && <small>{hint}</small>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="field toggle">
      <b>{label}</b>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => set(e.target.checked)} />
      <span className="switch" aria-hidden="true" />
    </label>
  );
}

function Heatmap({ days }: { days: Record<string, { r: number }> }) {
  const weeks = 20;
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (weeks * 7 - 1) - end.getDay());
  const cells: { k: string; v: number; future: boolean }[] = [];
  const d = new Date(start);
  for (let i = 0; i < (weeks + 1) * 7; i++) {
    const k = dayKey(d);
    cells.push({ k, v: days[k]?.r ?? 0, future: d > end });
    d.setDate(d.getDate() + 1);
  }
  const lvl = (v: number) => (v === 0 ? 0 : v < 10 ? 1 : v < 25 ? 2 : v < 50 ? 3 : 4);
  return (
    <div className="heatmap" role="img" aria-label="Mapa cieplna nauki">
      {cells.map((c) => (
        <span key={c.k} className={`h${c.future ? "x" : lvl(c.v)}`} title={`${c.k} · ${c.v} ${plural(c.v, "zadanie", "zadania", "zadań")}`} />
      ))}
    </div>
  );
}
