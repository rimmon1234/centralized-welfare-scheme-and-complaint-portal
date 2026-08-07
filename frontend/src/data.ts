import {
  Bug,
  FileText,
  HeartHandshake,
  LayoutGrid,
  MessagesSquare,
  Phone,
  Shield,
  Siren,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

/* ── Navigation ──────────────────────────────────────────── */

export type TabId = 'overview' | 'chat' | 'profile' | 'schemes' | 'helpline'

export interface Tab {
  id: TabId
  label: string
  icon: LucideIcon
}

export const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'chat', label: 'Sahayak chat', icon: MessagesSquare },
  { id: 'profile', label: 'My profile', icon: UserRound },
  { id: 'schemes', label: 'Scheme catalog', icon: FileText },
  { id: 'helpline', label: 'Helpline', icon: Phone },
]

/* ── Demo citizen ────────────────────────────────────────── */

export const user = {
  name: 'Asha Verma',
  initials: 'AV',
  meta: 'Female, 32 · Rural · Farmer · Income under ₹2L/yr',
}

/* ── Stats shown in the hero ─────────────────────────────── */

export const stats = [
  { value: '6', label: 'schemes matched' },
  { value: '4', label: 'reports tracked' },
  { value: '4.2 days', label: 'avg. resolution' },
]

/* ── Welfare schemes (rule-based eligibility matches) ────── */

export type CardColor =
  | 'lavender'
  | 'olive'
  | 'terracotta'
  | 'sage'
  | 'mauve'
  | 'khaki'

export type IllustrationKey =
  | 'spiral'
  | 'leaf'
  | 'sun'
  | 'health'
  | 'flower'
  | 'coins'

export interface Scheme {
  id: string
  title: string
  tag: string
  benefit: string
  color: CardColor
  illustration: IllustrationKey
  match: string
}

export const schemes: Scheme[] = [
  {
    id: 'pmay',
    title: 'PM Awas Yojana',
    tag: 'Housing',
    benefit: '₹2.5L housing grant',
    color: 'lavender',
    illustration: 'spiral',
    match: 'Likely eligible',
  },
  {
    id: 'nfsa',
    title: 'Ration Card (NFSA)',
    tag: 'Food security',
    benefit: '30 kg grain / month',
    color: 'olive',
    illustration: 'leaf',
    match: 'Likely eligible',
  },
  {
    id: 'pmkisan',
    title: 'PM-Kisan Samman Nidhi',
    tag: 'Farmer support',
    benefit: '₹6,000 / year',
    color: 'terracotta',
    illustration: 'sun',
    match: 'Likely eligible',
  },
  {
    id: 'ayushman',
    title: 'Ayushman Bharat',
    tag: 'Health cover',
    benefit: '₹5L health cover',
    color: 'sage',
    illustration: 'health',
    match: 'Verify documents',
  },
  {
    id: 'kanyashree',
    title: 'Kanyashree Prakalpa',
    tag: 'Girl child',
    benefit: '₹25,000 scholarship',
    color: 'mauve',
    illustration: 'flower',
    match: 'Likely eligible',
  },
  {
    id: 'sukanya',
    title: 'Sukanya Samriddhi',
    tag: 'Savings',
    benefit: '8.2% p.a. interest',
    color: 'khaki',
    illustration: 'coins',
    match: 'Likely eligible',
  },
]

/* ── Anonymous complaints & their resolution status ──────── */

export type Status = 'Resolved' | 'Under review' | 'Open'

export interface Complaint {
  id: string
  ref: string
  title: string
  location: string
  time: string
  status: Status
  days: number
}

export const complaints: Complaint[] = [
  {
    id: 'c1',
    ref: 'SR-1038',
    title: 'Street light outage',
    location: 'Ward 12, College Road',
    time: '2 days ago',
    status: 'Resolved',
    days: 3,
  },
  {
    id: 'c2',
    ref: 'SR-1041',
    title: 'Water supply disruption',
    location: 'Durganagar, Block B',
    time: 'yesterday',
    status: 'Under review',
    days: 1,
  },
  {
    id: 'c3',
    ref: 'SR-1024',
    title: 'Mid-day meal quality',
    location: 'Purba Para Primary School',
    time: '6 days ago',
    status: 'Resolved',
    days: 5,
  },
  {
    id: 'c4',
    ref: 'SR-1044',
    title: 'Harassment at ration shop',
    location: 'Fuleswar Ration Depot',
    time: 'today',
    status: 'Open',
    days: 0,
  },
]

/* ── Sahayak chat ────────────────────────────────────────── */

export interface Language {
  id: string
  label: string
}

export const languages: Language[] = [
  { id: 'bn', label: 'বাংলা' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'en', label: 'English' },
]

export const introMessages: Record<string, string> = {
  bn: 'নমস্কার, Asha! 🙏 আমি Sahayak — আপনার কল্যাণ সহায়ক। বাংলা, হিন্দি বা ইংরেজিতে, টেক্সট বা ভয়েসে প্রশ্ন করুন।',
  hi: 'नमस्ते, Asha! 🙏 मैं Sahayak हूँ — आपका कल्याण सहायक। बांग्ला, हिंदी या अंग्रेज़ी में, टाइप करके या आवाज़ से पूछिए।',
  en: 'Hello again, Asha! 🙏 I\u2019m Sahayak, your welfare assistant. Ask me anything — in Bengali, Hindi or English, by text or voice.',
}

export const quickReplies = [
  'Which schemes am I eligible for?',
  'How do I apply for Ration Card?',
  'Track my complaint',
  'Do I qualify for a housing scheme?',
]

export const botReplies = [
  'You\u2019re eligible for 6 schemes right now! The quickest is Ration Card (NFSA) — about 5 minutes with just your Aadhaar. Shall I open the form for you? 🧾',
  'Your report SR-1041 (Water supply disruption) is under review — day 1 of 7. If unresolved by day 7, it escalates automatically to the block officer. 🔔',
  'Most schemes need only 2 documents from you: Aadhaar and the income certificate — both are already verified in your profile. ✅',
  'Tip: applications filed through SevaNest are tracked end-to-end. You will get an SMS at every stage, in your chosen language. 📲',
]

/* ── Scheme catalog ──────────────────────────────────────── */

export type CatalogCategory =
  | 'Housing'
  | 'Food'
  | 'Health'
  | 'Farmer'
  | 'Education'
  | 'Women'
  | 'Savings'
  | 'Pension'

export const catalogCategories: CatalogCategory[] = [
  'Housing',
  'Food',
  'Health',
  'Farmer',
  'Education',
  'Women',
  'Savings',
  'Pension',
]

export interface CatalogScheme {
  id: string
  title: string
  category: CatalogCategory
  description: string
  benefit: string
  eligibility: string
  matched: boolean
}

export const catalogSchemes: CatalogScheme[] = [
  {
    id: 'pmay',
    title: 'PM Awas Yojana',
    category: 'Housing',
    description:
      'Build or upgrade a permanent house for your family with a central grant.',
    benefit: '₹2.5L housing grant',
    eligibility: 'Rural · income under ₹3L',
    matched: true,
  },
  {
    id: 'nfsa',
    title: 'Ration Card (NFSA)',
    category: 'Food',
    description:
      'Subsidised grain for every family member, delivered at your local depot.',
    benefit: '30 kg grain / month',
    eligibility: 'BPL households',
    matched: true,
  },
  {
    id: 'pmkisan',
    title: 'PM-Kisan Samman Nidhi',
    category: 'Farmer',
    description:
      'Direct income support for landholding farmers, credited to your bank account.',
    benefit: '₹6,000 / year',
    eligibility: 'Owns farmland',
    matched: true,
  },
  {
    id: 'ayushman',
    title: 'Ayushman Bharat',
    category: 'Health',
    description:
      'Cashless hospital cover for the whole family at empanelled hospitals.',
    benefit: '₹5L health cover',
    eligibility: 'Rural · income-linked',
    matched: true,
  },
  {
    id: 'kanyashree',
    title: 'Kanyashree Prakalpa',
    category: 'Education',
    description:
      'Annual scholarship to keep girls in school until they turn 18.',
    benefit: '₹25,000 scholarship',
    eligibility: 'Girl child · school-going',
    matched: true,
  },
  {
    id: 'sukanya',
    title: 'Sukanya Samriddhi',
    category: 'Savings',
    description:
      'A high-interest savings account for your daughter\u2019s education and marriage.',
    benefit: '8.2% p.a. interest',
    eligibility: 'Girl child under 10',
    matched: true,
  },
  {
    id: 'ujjwala',
    title: 'PM Ujjwala Yojana',
    category: 'Women',
    description:
      'Free LPG connection for women in BPL households — cleaner, safer cooking.',
    benefit: 'Free LPG connection',
    eligibility: 'Women · BPL',
    matched: false,
  },
  {
    id: 'mgnrega',
    title: 'MGNREGA',
    category: 'Farmer',
    description:
      'Guaranteed 100 days of wage work per year for rural households.',
    benefit: '100 days of work',
    eligibility: 'Rural adult · 18+',
    matched: false,
  },
  {
    id: 'jandhan',
    title: 'PM Jan Dhan Yojana',
    category: 'Savings',
    description:
      'A zero-balance bank account with accident cover and insurance benefits.',
    benefit: 'Zero-balance account + ₹2L cover',
    eligibility: 'All adults',
    matched: false,
  },
  {
    id: 'matru',
    title: 'Matru Vandana Yojana',
    category: 'Women',
    description:
      'Maternity benefit for the first child, paid in cash instalments.',
    benefit: '₹5,000 maternity benefit',
    eligibility: 'First pregnancy · 19+',
    matched: false,
  },
  {
    id: 'fasal',
    title: 'PM Fasal Bima Yojana',
    category: 'Farmer',
    description:
      'Crop insurance against drought, flood, pests and other natural risks.',
    benefit: 'Subsidised crop cover',
    eligibility: 'Cultivating farmers',
    matched: false,
  },
  {
    id: 'ignoaps',
    title: 'Old Age Pension (IGNOAPS)',
    category: 'Pension',
    description:
      'Monthly pension for senior citizens aged 60+ without other income.',
    benefit: '₹1,000 / month',
    eligibility: 'Age 60+ · BPL',
    matched: false,
  },
]

/* ── Citizen profile (My profile tab) ────────────────────── */

export interface ProfileRow {
  label: string
  value: string
}

export const profile = {
  personal: [
    { label: 'Full name', value: 'Asha Verma' },
    { label: 'Gender', value: 'Female' },
    { label: 'Age', value: '32 years' },
    { label: 'Aadhaar', value: '•••• 4432 · linked ✓' },
    { label: 'Mobile', value: '+91 98765 43210 · verified' },
    {
      label: 'Language',
      value: 'বাংলা (primary) · हिन्दी · English',
    },
  ],
  household: [
    { label: 'Village', value: 'Durganagar' },
    { label: 'Block', value: 'Uluberia-I' },
    { label: 'District', value: 'Howrah, West Bengal' },
    { label: 'Household size', value: '5 members' },
    { label: 'Ration card', value: 'BPL · yellow' },
  ],
  occupation: [
    { label: 'Occupation', value: 'Farmer (kharif + dairy)' },
    { label: 'Land owned', value: '1.2 acres' },
    { label: 'Annual income', value: '₹1.4L' },
    {
      label: 'Income source',
      value: 'Crops, dairy, MGNREGA days',
    },
  ],
  documents: [
    { label: 'Aadhaar', status: 'Verified', note: 'Linked to mobile' },
    { label: 'Voter ID', status: 'Verified', note: 'Electoral roll 2024' },
    { label: 'Income certificate', status: 'Verified', note: 'Issued 2026' },
    { label: 'Ration card', status: 'Verified', note: 'BPL category' },
    { label: 'Bank passbook', status: 'Pending', note: 'Upload front page' },
    { label: 'Land record (ROR)', status: 'Pending', note: 'Block office copy' },
  ] as { label: string; status: 'Verified' | 'Pending'; note: string }[],
  factors: [
    'Income under ₹2L',
    'Rural household',
    'Farmer',
    'Girl child in family',
    'BPL ration card',
  ],
}

/* ── Helpline ────────────────────────────────────────────── */

export const reportCategories = [
  'Civic issue',
  'Harassment',
  'Corruption',
  'Other',
] as const

export interface EmergencyContact {
  label: string
  number: string
  icon: LucideIcon
}

export const emergencyContacts: EmergencyContact[] = [
  { label: 'Police (emergency)', number: '100', icon: Shield },
  { label: 'Women helpline', number: '1091', icon: HeartHandshake },
  { label: 'Emergency response', number: '112', icon: Siren },
  { label: 'Cybercrime fraud', number: '1930', icon: Bug },
]

export const helplineSteps = [
  {
    title: 'Report anonymously',
    text: 'Describe the issue, attach photo or video evidence, and let us auto-locate it.',
  },
  {
    title: 'Track every step',
    text: 'Get SMS updates in your language — assigned, under review, resolved.',
  },
  {
    title: 'Auto-escalation',
    text: 'Unresolved after 7 days? Escalates to the block officer, then the district authority.',
  },
]
