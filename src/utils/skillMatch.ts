import { SavedProject } from '@/types/proposal';

const TECH_KEYWORDS = [
  'webflow','wordpress','wix','squarespace','shopify','woocommerce','magento','bigcommerce',
  'react','vue','angular','next.js','nextjs','nuxt','svelte',
  'python','django','flask','fastapi',
  'node','nodejs','express',
  'php','laravel','symfony','codeigniter',
  'ruby','rails',
  'flutter','react native','swift','kotlin','android','ios',
  'figma','sketch','adobe xd',
  'aws','azure','gcp',
  'docker','kubernetes',
  'mongodb','mysql','postgresql','redis','firebase',
  'gatsby','hugo','jekyll',
  'elementor','divi','beaver builder',
  'bubble','adalo','glide','softr',
  'zapier','make','n8n','airtable',
  'salesforce','hubspot','zoho',
  'java','spring','golang','rust','c#','.net',
  'typescript',
  'solidity','blockchain','web3',
  'tensorflow','pytorch',
  'seo','sem','google ads','facebook ads',
  'after effects','premiere','davinci resolve',
  'copywriting','content writing','ghostwriting',
];

export interface MatchResult {
  hasMismatch: boolean;
  jobRequires: string[];
  userCovers: string[];
  missingSkills: string[];
}

export function detectSkillMismatch(
  jobTitle: string,
  jobDescription: string,
  savedProjects: SavedProject[],
  noteTexts: string[],
): MatchResult {
  const jd = `${jobTitle} ${jobDescription}`.toLowerCase();
  const jobRequires = TECH_KEYWORDS.filter(kw => jd.includes(kw));

  if (jobRequires.length === 0) {
    return { hasMismatch: false, jobRequires: [], userCovers: [], missingSkills: [] };
  }

  const userCorpus = [
    ...savedProjects.map(p => `${p.name} ${p.description} ${(p.skills || []).join(' ')}`),
    ...noteTexts,
  ].join(' ').toLowerCase();

  const userCovers = jobRequires.filter(kw => userCorpus.includes(kw));
  const missingSkills = jobRequires.filter(kw => !userCorpus.includes(kw));

  // Only flag when ZERO job-required skills appear in user's profile
  const hasMismatch = savedProjects.length > 0 && missingSkills.length === jobRequires.length;

  return { hasMismatch, jobRequires, userCovers, missingSkills };
}
