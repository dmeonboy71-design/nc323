export interface Bank {
  id: string;
  name: string;
  nameUrdu: string;
  shortName: string;
  category: string;
  categoryUrdu: string;
  isPopular?: boolean;
}

export const PAKISTAN_BANKS: Bank[] = [
  // Digital Wallets & Branchless Banking
  {
    id: "jazzcash",
    name: "JazzCash (Mobilink Microfinance Bank)",
    nameUrdu: "جاز کیش (موبی لنک مائیکرو فنانس بینک)",
    shortName: "JazzCash",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ",
    isPopular: true
  },
  {
    id: "easypaisa",
    name: "EasyPaisa (Telenor Microfinance Bank)",
    nameUrdu: "ایزی پیسہ (ٹیلینار مائیکرو فنانس بینک)",
    shortName: "EasyPaisa",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ",
    isPopular: true
  },
  {
    id: "sadapay",
    name: "SadaPay",
    nameUrdu: "سادہ پے",
    shortName: "SadaPay",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ",
    isPopular: true
  },
  {
    id: "nayapay",
    name: "NayaPay",
    nameUrdu: "نیا پے",
    shortName: "NayaPay",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ",
    isPopular: true
  },
  {
    id: "raast",
    name: "Raast Instant Transfer (State Bank of Pakistan)",
    nameUrdu: "راست فوری ٹرانسفر (اسٹیٹ بینک آف پاکستان)",
    shortName: "Raast",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ",
    isPopular: true
  },
  {
    id: "upaisa",
    name: "UPaisa (U Microfinance Bank)",
    nameUrdu: "یو پیسہ (یو مائیکرو فنانس بینک)",
    shortName: "UPaisa",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ"
  },
  {
    id: "zindigi",
    name: "Zindigi App (JS Bank)",
    nameUrdu: "زندگی ایپ (جے ایس بینک)",
    shortName: "Zindigi",
    category: "Digital Wallets & Branchless",
    categoryUrdu: "ڈیجیٹل والٹس اور برانچ لیس بینکنگ"
  },

  // Major Commercial Banks (Private)
  {
    id: "hbl",
    name: "Habib Bank Limited (HBL)",
    nameUrdu: "حبیب بینک لمیٹڈ (HBL)",
    shortName: "HBL",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "ubl",
    name: "United Bank Limited (UBL)",
    nameUrdu: "یونائیٹڈ بینک لمیٹڈ (UBL)",
    shortName: "UBL",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "mcb",
    name: "MCB Bank Limited",
    nameUrdu: "مسلم کمرشل بینک (MCB)",
    shortName: "MCB",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "abl",
    name: "Allied Bank Limited (ABL)",
    nameUrdu: "الائیڈ بینک لمیٹڈ (ABL)",
    shortName: "ABL",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "alfalah",
    name: "Bank Alfalah Limited",
    nameUrdu: "بینک الفلاح لمیٹڈ",
    shortName: "Bank Alfalah",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "alhabib",
    name: "Bank AL Habib Limited",
    nameUrdu: "بینک الحبیب لمیٹڈ",
    shortName: "Bank AL Habib",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک",
    isPopular: true
  },
  {
    id: "askari",
    name: "Askari Bank Limited",
    nameUrdu: "عسکری بینک لمیٹڈ",
    shortName: "Askari Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "faysal",
    name: "Faysal Bank Limited",
    nameUrdu: "فیصل بینک لمیٹڈ",
    shortName: "Faysal Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "habibmetro",
    name: "Habib Metropolitan Bank",
    nameUrdu: "حبیب میٹروپولیٹن بینک",
    shortName: "HabibMetro",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "soneri",
    name: "Soneri Bank Limited",
    nameUrdu: "سونری بینک لمیٹڈ",
    shortName: "Soneri Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "standardchartered",
    name: "Standard Chartered Bank Pakistan",
    nameUrdu: "اسٹینڈرڈ چارٹرڈ بینک پاکستان",
    shortName: "Standard Chartered",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "jsbank",
    name: "JS Bank Limited",
    nameUrdu: "جے ایس بینک لمیٹڈ",
    shortName: "JS Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "sambabank",
    name: "Samba Bank Limited",
    nameUrdu: "سامبا بینک لمیٹڈ",
    shortName: "Samba Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "silkbank",
    name: "Silkbank Limited",
    nameUrdu: "سلک بینک لمیٹڈ",
    shortName: "Silkbank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "bankmakramah",
    name: "Bank Makramah Limited (BML / Summit Bank)",
    nameUrdu: "بنک مکرّمہ (سمٹ بینک)",
    shortName: "Bank Makramah",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "citibank",
    name: "CitiBank N.A. Pakistan",
    nameUrdu: "سٹی بینک پاکستان",
    shortName: "CitiBank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "deutsche",
    name: "Deutsche Bank AG Pakistan",
    nameUrdu: "ڈوئچے بینک پاکستان",
    shortName: "Deutsche Bank",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "icbc",
    name: "Industrial and Commercial Bank of China (ICBC)",
    nameUrdu: "آئی سی بی سی پاکستان",
    shortName: "ICBC",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },
  {
    id: "bankofchina",
    name: "Bank of China Limited",
    nameUrdu: "بینک آف چائنا",
    shortName: "Bank of China",
    category: "Commercial Banks",
    categoryUrdu: "کمرشل بینک"
  },

  // Islamic Commercial Banks
  {
    id: "meezan",
    name: "Meezan Bank Limited (Islamic)",
    nameUrdu: "میزان بینک لمیٹڈ (اسلامک)",
    shortName: "Meezan Bank",
    category: "Islamic Banks",
    categoryUrdu: "اسلامک بینک",
    isPopular: true
  },
  {
    id: "bankislami",
    name: "BankIslami Pakistan Limited",
    nameUrdu: "بینک اسلامی پاکستان لمیٹڈ",
    shortName: "BankIslami",
    category: "Islamic Banks",
    categoryUrdu: "اسلامک بینک"
  },
  {
    id: "dib",
    name: "Dubai Islamic Bank Pakistan (DIB)",
    nameUrdu: "دبئی اسلامک بینک پاکستان",
    shortName: "Dubai Islamic Bank",
    category: "Islamic Banks",
    categoryUrdu: "اسلامک بینک"
  },
  {
    id: "albaraka",
    name: "Al Baraka Bank (Pakistan) Limited",
    nameUrdu: "البرکہ بینک پاکستان لمیٹڈ",
    shortName: "Al Baraka",
    category: "Islamic Banks",
    categoryUrdu: "اسلامک بینک"
  },
  {
    id: "mcbislamic",
    name: "MCB Islamic Bank Limited",
    nameUrdu: "ایم سی بی اسلامک بینک",
    shortName: "MCB Islamic",
    category: "Islamic Banks",
    categoryUrdu: "اسلامک بینک"
  },

  // Public Sector & Provincial Government Banks
  {
    id: "nbp",
    name: "National Bank of Pakistan (NBP)",
    nameUrdu: "نیشنل بینک آف پاکستان (NBP)",
    shortName: "NBP",
    category: "Public Sector & Provincial Banks",
    categoryUrdu: "قومی اور صوبائی بینک",
    isPopular: true
  },
  {
    id: "bop",
    name: "The Bank of Punjab (BOP)",
    nameUrdu: "دی بینک آف پنجاب (BOP)",
    shortName: "Bank of Punjab",
    category: "Public Sector & Provincial Banks",
    categoryUrdu: "قومی اور صوبائی بینک",
    isPopular: true
  },
  {
    id: "sindhbank",
    name: "Sindh Bank Limited",
    nameUrdu: "سندھ بینک لمیٹڈ",
    shortName: "Sindh Bank",
    category: "Public Sector & Provincial Banks",
    categoryUrdu: "قومی اور صوبائی بینک"
  },
  {
    id: "bok",
    name: "The Bank of Khyber (BOK)",
    nameUrdu: "دی بینک آف خیبر (BOK)",
    shortName: "Bank of Khyber",
    category: "Public Sector & Provincial Banks",
    categoryUrdu: "قومی اور صوبائی بینک"
  },
  {
    id: "fwbl",
    name: "First Women Bank Limited (FWBL)",
    nameUrdu: "فرسٹ ویمن بینک لمیٹڈ",
    shortName: "First Women Bank",
    category: "Public Sector & Provincial Banks",
    categoryUrdu: "قومی اور صوبائی بینک"
  },

  // Microfinance Banks
  {
    id: "mobilink_mfb",
    name: "Mobilink Microfinance Bank Limited",
    nameUrdu: "موبی لنک مائیکرو فنانس بینک",
    shortName: "Mobilink MFB",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "telenor_mfb",
    name: "Telenor Microfinance Bank Limited",
    nameUrdu: "ٹیلینار مائیکرو فنانس بینک",
    shortName: "Telenor MFB",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "khushhali",
    name: "Khushhali Microfinance Bank Limited",
    nameUrdu: "خوشحالی مائیکرو فنانس بینک",
    shortName: "Khushhali Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "ubank",
    name: "U Microfinance Bank Limited (U Bank)",
    nameUrdu: "یو مائیکرو فنانس بینک (یو بینک)",
    shortName: "U Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "finca",
    name: "FINCA Microfinance Bank Limited",
    nameUrdu: "فنکا مائیکرو فنانس بینک",
    shortName: "FINCA Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "nrsp",
    name: "NRSP Microfinance Bank Limited",
    nameUrdu: "این آر ایس پی مائیکرو فنانس بینک",
    shortName: "NRSP Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "apna_mfb",
    name: "Apna Microfinance Bank Limited",
    nameUrdu: "اپنا مائیکرو فنانس بینک",
    shortName: "Apna Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "pak_oman_mfb",
    name: "Pak-Oman Microfinance Bank Limited",
    nameUrdu: "پاک عمان مائیکرو فنانس بینک",
    shortName: "Pak-Oman MFB",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "advans_mfb",
    name: "Advans Pakistan Microfinance Bank",
    nameUrdu: "ایڈوانس پاکستان مائیکرو فنانس بینک",
    shortName: "Advans Bank",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },
  {
    id: "sindh_mfb",
    name: "Sindh Microfinance Bank Limited",
    nameUrdu: "سندھ مائیکرو فنانس بینک",
    shortName: "Sindh MFB",
    category: "Microfinance Banks",
    categoryUrdu: "مائیکرو فنانس بینک"
  },

  // Specialized & Development Financial Institutions
  {
    id: "ztbl",
    name: "Zarai Taraqiati Bank Limited (ZTBL)",
    nameUrdu: "زرعی ترقیاتی بینک لمیٹڈ (ZTBL)",
    shortName: "ZTBL",
    category: "Specialized Financial Institutions",
    categoryUrdu: "خصوصی مالیاتی ادارے"
  },
  {
    id: "ppcb",
    name: "The Punjab Provincial Cooperative Bank (PPCB)",
    nameUrdu: "پنجاب پراونشل کوآپریٹو بینک",
    shortName: "PPCB",
    category: "Specialized Financial Institutions",
    categoryUrdu: "خصوصی مالیاتی ادارے"
  },
  {
    id: "hbfc",
    name: "House Building Finance Company (HBFC)",
    nameUrdu: "ہاؤس بلڈنگ فنانس کمپنی (HBFC)",
    shortName: "HBFC",
    category: "Specialized Financial Institutions",
    categoryUrdu: "خصوصی مالیاتی ادارے"
  },
  {
    id: "sme",
    name: "SME Bank Limited",
    nameUrdu: "ایس ایم ای بینک لمیٹڈ",
    shortName: "SME Bank",
    category: "Specialized Financial Institutions",
    categoryUrdu: "خصوصی مالیاتی ادارے"
  }
];

export const BANK_CATEGORIES = [
  { key: "Digital Wallets & Branchless", titleEn: "Digital Wallets & Branchless Banking", titleUrdu: "ڈیجیٹل والٹس اور موبائل اکاؤنٹ" },
  { key: "Commercial Banks", titleEn: "Commercial Banks", titleUrdu: "کمرشل بینک" },
  { key: "Islamic Banks", titleEn: "Islamic Banks (Shariah Compliant)", titleUrdu: "اسلامک بینک (شریعہ کمپلائنٹ)" },
  { key: "Public Sector & Provincial Banks", titleEn: "Public Sector & Provincial Banks", titleUrdu: "سرکاری اور صوبائی بینک" },
  { key: "Microfinance Banks", titleEn: "Microfinance Banks", titleUrdu: "مائیکرو فنانس بینک" },
  { key: "Specialized Financial Institutions", titleEn: "Specialized Development Institutions", titleUrdu: "خصوصی ترقیاتی ادارے" }
];
