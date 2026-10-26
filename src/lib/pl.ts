/** Polish plural: 1 → one, 2–4 (except 12–14) → few, everything else → many. */
export function plural(n: number, one: string, few: string, many: string) {
  const a = Math.abs(n);
  if (a === 1) return one;
  const last = a % 10;
  const tens = a % 100;
  return last >= 2 && last <= 4 && !(tens >= 12 && tens <= 14) ? few : many;
}

export const DAYS_PL = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
export const DAYS_SHORT_PL = ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];
export const MONTHS_PL_GEN = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
