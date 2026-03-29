// Complete Zohar corpus structure derived from Sefaria API
// Includes: Zohar (main), Tikkunei Zohar, and Zohar Chadash

export interface ZoharSection {
  nameEn: string;
  nameHe: string;
  sefariaRef: string; // exact Sefaria API reference for fetching text
  totalUnits: number; // chapters, dapim, or paragraph-groups
  corpus: "zohar" | "tikkunei" | "chadash";
  addressType: "chapter" | "daf" | "paragraph"; // how units are addressed
}

// ============================================================
// PART 1: ZOHAR (Main body) — organized by parasha, chapter-based
// ============================================================
const ZOHAR_MAIN: ZoharSection[] = [
  // ספר בראשית
  { nameEn: "Introduction", nameHe: "הקדמה", sefariaRef: "Zohar, Introduction", totalUnits: 34, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Bereshit", nameHe: "בראשית", sefariaRef: "Zohar, Bereshit", totalUnits: 102, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Noach", nameHe: "נח", sefariaRef: "Zohar, Noach", totalUnits: 44, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Lech Lecha", nameHe: "לך לך", sefariaRef: "Zohar, Lech Lecha", totalUnits: 35, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayera", nameHe: "וירא", sefariaRef: "Zohar, Vayera", totalUnits: 36, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Chayei Sara", nameHe: "חיי שרה", sefariaRef: "Zohar, Chayei Sara", totalUnits: 27, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Toldot", nameHe: "תולדות", sefariaRef: "Zohar, Toldot", totalUnits: 19, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayetzei", nameHe: "ויצא", sefariaRef: "Zohar, Vayetzei", totalUnits: 43, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayishlach", nameHe: "וישלח", sefariaRef: "Zohar, Vayishlach", totalUnits: 30, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayeshev", nameHe: "וישב", sefariaRef: "Zohar, Vayeshev", totalUnits: 25, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Miketz", nameHe: "מקץ", sefariaRef: "Zohar, Miketz", totalUnits: 15, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayigash", nameHe: "ויגש", sefariaRef: "Zohar, Vayigash", totalUnits: 12, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayechi", nameHe: "ויחי", sefariaRef: "Zohar, Vayechi", totalUnits: 86, corpus: "zohar", addressType: "chapter" },
  // ספר שמות
  { nameEn: "Shemot", nameHe: "שמות", sefariaRef: "Zohar, Shemot", totalUnits: 52, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vaera", nameHe: "וארא", sefariaRef: "Zohar, Vaera", totalUnits: 22, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Bo", nameHe: "בא", sefariaRef: "Zohar, Bo", totalUnits: 17, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Beshalach", nameHe: "בשלח", sefariaRef: "Zohar, Beshalach", totalUnits: 34, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Yitro", nameHe: "יתרו", sefariaRef: "Zohar, Yitro", totalUnits: 35, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Mishpatim", nameHe: "משפטים", sefariaRef: "Zohar, Mishpatim", totalUnits: 30, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Terumah", nameHe: "תרומה", sefariaRef: "Zohar, Terumah", totalUnits: 98, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Sifra DiTzniuta", nameHe: "ספרא דצניעותא", sefariaRef: "Zohar, Sifra DiTzniuta", totalUnits: 6, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Tetzaveh", nameHe: "תצוה", sefariaRef: "Zohar, Tetzaveh", totalUnits: 18, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Ki Tisa", nameHe: "כי תשא", sefariaRef: "Zohar, Ki Tisa", totalUnits: 12, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayakhel", nameHe: "ויקהל", sefariaRef: "Zohar, Vayakhel", totalUnits: 43, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Pekudei", nameHe: "פקודי", sefariaRef: "Zohar, Pekudei", totalUnits: 63, corpus: "zohar", addressType: "chapter" },
  // ספר ויקרא
  { nameEn: "Vayikra", nameHe: "ויקרא", sefariaRef: "Zohar, Vayikra", totalUnits: 67, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Tzav", nameHe: "צו", sefariaRef: "Zohar, Tzav", totalUnits: 30, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Shmini", nameHe: "שמיני", sefariaRef: "Zohar, Shmini", totalUnits: 16, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Tazria", nameHe: "תזריע", sefariaRef: "Zohar, Tazria", totalUnits: 35, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Metzora", nameHe: "מצורע", sefariaRef: "Zohar, Metzora", totalUnits: 16, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Achrei Mot", nameHe: "אחרי מות", sefariaRef: "Zohar, Achrei Mot", totalUnits: 75, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Kedoshim", nameHe: "קדושים", sefariaRef: "Zohar, Kedoshim", totalUnits: 21, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Emor", nameHe: "אמור", sefariaRef: "Zohar, Emor", totalUnits: 51, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Behar", nameHe: "בהר", sefariaRef: "Zohar, Behar", totalUnits: 14, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Bechukotai", nameHe: "בחוקותי", sefariaRef: "Zohar, Bechukotai", totalUnits: 16, corpus: "zohar", addressType: "chapter" },
  // ספר במדבר
  { nameEn: "Bamidbar", nameHe: "במדבר", sefariaRef: "Zohar, Bamidbar", totalUnits: 8, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Nasso", nameHe: "נשא", sefariaRef: "Zohar, Nasso", totalUnits: 23, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Idra Rabba", nameHe: "אדרא רבא", sefariaRef: "Zohar, Idra Rabba", totalUnits: 52, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Beha'alotcha", nameHe: "בהעלותך", sefariaRef: "Zohar, Beha'alotcha", totalUnits: 27, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Sh'lach", nameHe: "שלח לך", sefariaRef: "Zohar, Sh'lach", totalUnits: 46, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Korach", nameHe: "קרח", sefariaRef: "Zohar, Korach", totalUnits: 14, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Chukat", nameHe: "חוקת", sefariaRef: "Zohar, Chukat", totalUnits: 12, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Balak", nameHe: "בלק", sefariaRef: "Zohar, Balak", totalUnits: 47, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Pinchas", nameHe: "פנחס", sefariaRef: "Zohar, Pinchas", totalUnits: 129, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Matot", nameHe: "מטות", sefariaRef: "Zohar, Matot", totalUnits: 1, corpus: "zohar", addressType: "chapter" },
  // ספר דברים
  { nameEn: "Vaetchanan", nameHe: "ואתחנן", sefariaRef: "Zohar, Vaetchanan", totalUnits: 32, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Eikev", nameHe: "עקב", sefariaRef: "Zohar, Eikev", totalUnits: 6, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Shoftim", nameHe: "שופטים", sefariaRef: "Zohar, Shoftim", totalUnits: 5, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Ki Teitzei", nameHe: "כי תצא", sefariaRef: "Zohar, Ki Teitzei", totalUnits: 30, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Vayeilech", nameHe: "וילך", sefariaRef: "Zohar, Vayeilech", totalUnits: 9, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Ha'Azinu", nameHe: "האזינו", sefariaRef: "Zohar, Ha'Azinu", totalUnits: 17, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Idra Zuta", nameHe: "אדרא זוטא", sefariaRef: "Zohar, Idra Zuta", totalUnits: 43, corpus: "zohar", addressType: "chapter" },
  // כרכים נוספים
  { nameEn: "Volume I", nameHe: "כרך א", sefariaRef: "Zohar, Volume I", totalUnits: 53, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Volume II", nameHe: "כרך ב", sefariaRef: "Zohar, Volume II", totalUnits: 10, corpus: "zohar", addressType: "chapter" },
  { nameEn: "Volume III", nameHe: "כרך ג", sefariaRef: "Zohar, Volume III", totalUnits: 18, corpus: "zohar", addressType: "chapter" },
];

// ============================================================
// PART 2: TIKKUNEI ZOHAR — 295 dapim (Talmud-style a/b pages)
// ============================================================
function generateTikkuneiPages(): ZoharSection[] {
  const sections: ZoharSection[] = [];
  // Tikkunei Zohar has dapim from 1a to 148b (295 total pages in Talmud addressing)
  // We'll create groups of ~4 dapim each to keep it manageable (about 74 reading units)
  const totalDapim = 295;
  const groupSize = 4;
  const groups = Math.ceil(totalDapim / groupSize);

  for (let g = 0; g < groups; g++) {
    const startDaf = g * groupSize + 1;
    const endDaf = Math.min((g + 1) * groupSize, totalDapim);
    // Convert daf number to Talmud-style: 1=1a, 2=1b, 3=2a, 4=2b, etc.
    const dafToTalmud = (n: number) => {
      const page = Math.ceil(n / 2);
      const side = n % 2 === 1 ? "a" : "b";
      return `${page}${side}`;
    };
    const startRef = dafToTalmud(startDaf);
    const endRef = dafToTalmud(endDaf);
    const heStart = dafToTalmud(startDaf).replace("a", " ע\"א").replace("b", " ע\"ב");
    const heEnd = dafToTalmud(endDaf).replace("a", " ע\"א").replace("b", " ע\"ב");

    sections.push({
      nameEn: `Tikkunei Zohar ${startRef}-${endRef}`,
      nameHe: `תיקוני זוהר דף ${heStart} - ${heEnd}`,
      // For Tikkunei, we reference the first daf of each group
      sefariaRef: `Tikkunei Zohar.${startRef}`,
      totalUnits: 1, // each group = 1 reading unit
      corpus: "tikkunei",
      addressType: "daf",
    });
  }
  return sections;
}

// ============================================================
// PART 3: ZOHAR CHADASH — organized by parasha/section, paragraph-based
// We group paragraphs into reading units of ~30 paragraphs each
// ============================================================
const ZOHAR_CHADASH_RAW: Array<{ nameEn: string; nameHe: string; ref: string; paragraphs: number }> = [
  { nameEn: "ZC Bereshit", nameHe: "זו\"ח בראשית", ref: "Zohar Chadash, Bereshit", paragraphs: 861 },
  { nameEn: "ZC Noach", nameHe: "זו\"ח נח", ref: "Zohar Chadash, Noach", paragraphs: 153 },
  { nameEn: "ZC Lech Lecha", nameHe: "זו\"ח לך לך", ref: "Zohar Chadash, Lech Lecha", paragraphs: 115 },
  { nameEn: "ZC Vayera", nameHe: "זו\"ח וירא", ref: "Zohar Chadash, Vayera", paragraphs: 4 },
  { nameEn: "ZC Toldot", nameHe: "זו\"ח תולדות", ref: "Zohar Chadash, Toldot", paragraphs: 41 },
  { nameEn: "ZC Vayetzei", nameHe: "זו\"ח ויצא", ref: "Zohar Chadash, Vayetzei", paragraphs: 75 },
  { nameEn: "ZC Vayeshev", nameHe: "זו\"ח וישב", ref: "Zohar Chadash, Vayeshev", paragraphs: 48 },
  { nameEn: "ZC Beshalach", nameHe: "זו\"ח בשלח", ref: "Zohar Chadash, Beshalach", paragraphs: 45 },
  { nameEn: "ZC Yitro", nameHe: "זו\"ח יתרו", ref: "Zohar Chadash, Yitro", paragraphs: 511 },
  { nameEn: "ZC Terumah", nameHe: "זו\"ח תרומה", ref: "Zohar Chadash, Terumah", paragraphs: 78 },
  { nameEn: "ZC Ki Tisa", nameHe: "זו\"ח כי תשא", ref: "Zohar Chadash, Ki Tisa", paragraphs: 107 },
  { nameEn: "ZC Tzav", nameHe: "זו\"ח צו", ref: "Zohar Chadash, Tzav", paragraphs: 8 },
  { nameEn: "ZC Achrei Mot", nameHe: "זו\"ח אחרי מות", ref: "Zohar Chadash, Achrei Mot", paragraphs: 125 },
  { nameEn: "ZC Behar", nameHe: "זו\"ח בהר", ref: "Zohar Chadash, Behar", paragraphs: 17 },
  { nameEn: "ZC Nasso", nameHe: "זו\"ח נשא", ref: "Zohar Chadash, Nasso", paragraphs: 4 },
  { nameEn: "ZC Chukat", nameHe: "זו\"ח חוקת", ref: "Zohar Chadash, Chukat", paragraphs: 138 },
  { nameEn: "ZC Balak", nameHe: "זו\"ח בלק", ref: "Zohar Chadash, Balak", paragraphs: 137 },
  { nameEn: "ZC Matot", nameHe: "זו\"ח מטות", ref: "Zohar Chadash, Matot", paragraphs: 7 },
  { nameEn: "ZC Vaetchanan", nameHe: "זו\"ח ואתחנן", ref: "Zohar Chadash, Vaetchanan", paragraphs: 94 },
  { nameEn: "ZC Ki Teitzei", nameHe: "זו\"ח כי תצא", ref: "Zohar Chadash, Ki Teitzei", paragraphs: 47 },
  { nameEn: "ZC Ki Tavo", nameHe: "זו\"ח כי תבוא", ref: "Zohar Chadash, Ki Tavo", paragraphs: 40 },
  { nameEn: "ZC Shir HaShirim", nameHe: "זו\"ח שיר השירים", ref: "Zohar Chadash, Shir HaShirim", paragraphs: 662 },
  { nameEn: "ZC Midrash Rut", nameHe: "זו\"ח מדרש רות", ref: "Zohar Chadash, Midrash Rut", paragraphs: 742 },
  { nameEn: "ZC Eichah", nameHe: "זו\"ח מדרש הנעלם על איכה", ref: "Zohar Chadash, Midrash HaNe'elam Al Eichah", paragraphs: 118 },
  { nameEn: "ZC Tikkunim", nameHe: "זו\"ח תיקונים", ref: "Zohar Chadash, Tikkunim Mizohar Chadash", paragraphs: 5 },
  { nameEn: "ZC Sifra Tanina", nameHe: "זו\"ח ספרא תנינא", ref: "Zohar Chadash, Sifra Tanina", paragraphs: 107 },
  { nameEn: "ZC Tikuna Kadma'ah", nameHe: "זו\"ח תיקונא קדמאה", ref: "Zohar Chadash, Tikuna Kadma'ah", paragraphs: 102 },
];

function generateZoharChadashSections(): ZoharSection[] {
  const sections: ZoharSection[] = [];
  const groupSize = 30; // ~30 paragraphs per reading unit

  for (const raw of ZOHAR_CHADASH_RAW) {
    if (raw.paragraphs <= groupSize) {
      // Small section = single reading unit
      sections.push({
        nameEn: raw.nameEn,
        nameHe: raw.nameHe,
        sefariaRef: raw.ref,
        totalUnits: 1,
        corpus: "chadash",
        addressType: "paragraph",
      });
    } else {
      // Split into groups
      const groups = Math.ceil(raw.paragraphs / groupSize);
      for (let g = 0; g < groups; g++) {
        const start = g * groupSize + 1;
        const end = Math.min((g + 1) * groupSize, raw.paragraphs);
        sections.push({
          nameEn: `${raw.nameEn} ${start}-${end}`,
          nameHe: `${raw.nameHe} ${start}-${end}`,
          sefariaRef: raw.ref,
          totalUnits: 1,
          corpus: "chadash",
          addressType: "paragraph",
        });
      }
    }
  }
  return sections;
}

// ============================================================
// COMBINED STRUCTURE
// ============================================================
export const ZOHAR_STRUCTURE = [
  ...ZOHAR_MAIN,
  ...generateTikkuneiPages(),
  ...generateZoharChadashSections(),
];

export const TOTAL_ZOHAR_PAGES = ZOHAR_STRUCTURE.reduce((sum, s) => sum + s.totalUnits, 0);

// Generate all pages for a reading
export function generateZoharPages(): Array<{
  pageNumber: number;
  sefariaRef: string;
  displayName: string;
  parasha: string;
}> {
  const allPages: Array<{
    pageNumber: number;
    sefariaRef: string;
    displayName: string;
    parasha: string;
  }> = [];

  let pageNumber = 1;

  // Zohar main — each unit is a chapter
  for (const section of ZOHAR_MAIN) {
    for (let ch = 1; ch <= section.totalUnits; ch++) {
      allPages.push({
        pageNumber,
        sefariaRef: `${section.sefariaRef}.${ch}`,
        displayName: `${section.nameHe} - דף ${ch}`,
        parasha: section.nameHe,
      });
      pageNumber++;
    }
  }

  // Tikkunei Zohar — each unit is a group of dapim
  const tikkuneiSections = generateTikkuneiPages();
  for (const section of tikkuneiSections) {
    allPages.push({
      pageNumber,
      sefariaRef: section.sefariaRef,
      displayName: section.nameHe,
      parasha: "תיקוני זוהר",
    });
    pageNumber++;
  }

  // Zohar Chadash — each unit is a paragraph group
  const zcSections = generateZoharChadashSections();
  for (const section of zcSections) {
    allPages.push({
      pageNumber,
      sefariaRef: section.sefariaRef,
      displayName: section.nameHe,
      parasha: "זוהר חדש",
    });
    pageNumber++;
  }

  return allPages;
}
