import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck, Copy, FileText, LockKeyhole, RefreshCw, Sparkles, WandSparkles } from 'lucide-react';
import './StorybookWorkflow.css';

const STORAGE_KEY = 'mlcs-storybook-studio-v22';
const stages = [
  { title: 'Story concept & titles', short: 'Concept', detail: 'Find the heart of the story and choose its direction.' },
  { title: 'Story architecture & Character Bible', short: 'Characters', detail: 'Shape the plot and lock the visual identity of every character.' },
  { title: 'Complete manuscript', short: 'Manuscript', detail: 'Write the final read-aloud text, page by page.' },
  { title: 'Page-by-page storyboard', short: 'Storyboard', detail: 'Translate every approved page into a clear visual scene.' },
  { title: 'Cover & illustration prompts', short: 'Illustrations', detail: 'Prepare the cover and independent prompts for every story page.' },
  { title: 'Final quality control', short: 'Quality check', detail: 'Audit continuity, age suitability and production requirements.' },
];
const defaults = {
  title: '', age: '3–5 years', pages: '10 story pages', customPages: '20', theme: '', customTheme: '', character: '', characterType: 'Friendly animal', customCharacter: '', supportingCharacters: '', setting: '', conflict: '', lesson: '', customLesson: '', ending: 'Hopeful and heartwarming',
  storyFormat: 'Standalone story', narration: 'Third-person narrator', plot: 'Problem-solving adventure', tone: 'Warm and heartwarming', vocabulary: 'Simple, familiar vocabulary', readingLevel: 'Read-aloud', dialogue: 'Balanced narration and dialogue',
  appearance: '', personality: '', clothing: '', distinctive: '', relationships: '', consistency: 'Character locked',
  bookSize: '20 × 20 cm square', customSize: '', orientation: 'Square', bleed: '3 mm', safeMargin: '10 mm', textPlacement: 'Text below illustration', illustrationPlacement: 'Illustration panel above text area', pageNumbering: 'Automatic numbering', pageNumberPosition: 'Bottom right', footerSpace: 'Small',
  illustrationStyle: 'Soft watercolor', palette: 'Warm natural woodland palette', lighting: 'Soft, gentle natural lighting', backgroundDetail: 'Moderate detail, uncluttered', composition: 'Clear focal point with child-friendly framing', customStyle: '', negativePrompt: 'No extra characters, no inconsistent clothing, no distorted anatomy, no watermarks, no logos, no unrequested lettering or text.'
};
const stageInstructions = [
`You are an expert children's picture-book author, early-years learning designer and story editor. Using the supplied project brief, produce ONLY STAGE 1: STORY CONCEPT & TITLES. Provide three distinct age-appropriate title options; recommend one and explain why; write a concise synopsis; state the central emotional promise; identify the central story question and the simple problem the protagonist will try to solve. Do not write the manuscript, storyboard or illustration prompts yet. Preserve every supplied name and detail exactly. Identify assumptions clearly. End by asking the creator to review and approve this stage.`,
`You are an expert children's picture-book developmental editor and character designer. Using the supplied brief and APPROVED STAGE 1, produce ONLY STAGE 2: STORY ARCHITECTURE & CHARACTER BIBLE. Outline opening, inciting moment, development, climax, resolution and emotional arc. Establish a coherent setting with reusable landmarks and simple geography. Define every recurring character: exact name spelling, species, age impression, proportions, face, eyes, colors, markings, clothing/accessories, silhouette, personality (3–5 traits), mannerisms and relationships. Create a concise reusable character-lock paragraph for each character. Keep the problem understandable and solvable for the target age. Do not write the manuscript yet. Preserve approved decisions and supplied names exactly. End by asking for approval.`,
`You are an expert children's picture-book author. Using the supplied brief and APPROVED STAGES 1–2, produce ONLY STAGE 3: COMPLETE MANUSCRIPT. Write exactly the requested number of numbered interior story pages, excluding the separate cover. For each page provide page purpose, exact final read-aloud text and optional art-only notes. Respect the target age, narration, vocabulary, reading experience, tone and dialogue settings. Create purposeful page turns, varied action and a satisfying resolution. The moral must emerge through character actions, not a lecture. Do not create storyboard or illustration prompts yet. Do not change approved character names or designs. End by asking for manuscript approval.`,
`You are an expert picture-book storyboard artist and art director. Using the APPROVED manuscript and Character Bible, produce ONLY STAGE 4: PAGE-BY-PAGE STORYBOARD. Create one storyboard entry for every interior story page. Repeat the exact manuscript text VERBATIM, without editing or paraphrasing it. For each page describe setting, characters present, action, emotion, composition, camera angle/distance, foreground, background and focal point. State clearly where the text area and reserved page-number footer must remain unobstructed. Do not add, remove or rewrite story events. End by asking for approval.`,
`You are an expert children's picture-book art director and image-prompt designer. Using the APPROVED Character Bible, manuscript and storyboard, produce ONLY STAGE 5: COVER & ILLUSTRATION PROMPTS. Provide one separate cover concept and one detailed standalone cover illustration prompt, plus EXACTLY one independent detailed illustration prompt for each interior story page. Repeat relevant fixed character-lock traits in every applicable prompt. Maintain consistent character scale, geography, time progression, palette and art direction while varying camera distance purposefully. Specify an illustration panel above the text area within the final page layout; do not request a full-page image that leaves no room for text. Include trim/orientation guidance, text-safe area, and bleed/safe-margin reminders for final layout. For every interior page, keep the bottom-right footer zone clear for automatic page numbering during final layout. The illustration must occupy a dedicated upper panel, leaving the approved text area below; do not create a full-page illustration that leaves no room for text. Never render text, lettering, captions, speech bubbles, logos, watermarks, signatures or page numbers inside artwork. Give title placement guidance separately from the image prompt. End by asking for approval.`,
`You are an independent children's publishing editor and print-production quality controller. Audit the APPROVED concept, Character Bible, manuscript, storyboard and illustration prompts. Return a PASS / NEEDS REVISION checklist with specific findings. Check exact interior page count; manuscript/storyboard text match; exact character names and appearance; clothing/accessories; setting geography; props; time progression; emotional continuity; page-turn flow; story resolution; age suitability; grammar; spelling; read-aloud clarity; natural moral; factual accuracy where relevant; separate cover; exactly one illustration prompt per interior page; no unrequested text in artwork; and print specifications including bleed, safe margins and reserved automatic page-number footer zone. Do not silently rewrite approved content. Identify each correction by stage and page. End with an overall production-readiness verdict.`
];

function buildBrief(f) {
  const pages = f.pages === 'Custom length' ? (f.customPages || '20') : (f.pages || '10 story pages').replace(' story pages', '');
  return `PROJECT BRIEF\nWorking title: ${f.title || '[Not supplied: propose options]'}\nTarget age: ${f.age}\nStory length: ${pages} interior story pages, plus a separate cover\nTheme / genre: ${f.theme === 'Other (custom)' ? (f.customTheme || '[Custom theme not supplied]') : (f.theme || '[Develop a suitable theme and identify it as an assumption]')}\nMain character: ${f.characterType === 'Other (custom)' ? (f.customCharacter || '[Custom character not supplied]') : f.characterType}${f.character ? `; creator's character idea: ${f.character}` : ''}\nSupporting characters: ${f.supportingCharacters || 'Add only if the story needs them'}\nSetting / world: ${f.setting || '[Create a vivid, coherent setting and identify it as an assumption]'}\nMain problem / adventure: ${f.conflict || '[Create a simple, age-appropriate solvable problem and identify it as an assumption]'}\nMoral / learning message: ${f.lesson === 'Other (custom)' ? (f.customLesson || '[Custom learning message not supplied]') : (f.lesson || '[Choose a meaningful, non-preachy lesson and identify it as an assumption]')}\nDesired ending: ${f.ending}\nBook format: ${f.storyFormat}\nNarration: ${f.narration}\nPlot structure: ${f.plot}\nEmotional tone: ${f.tone}\nVocabulary: ${f.vocabulary}\nReading experience: ${f.readingLevel}\nDialogue: ${f.dialogue}\n\nCHARACTER DESIGN AND CONTINUITY\nPhysical appearance: ${f.appearance || '[Define precise, repeatable physical traits]'}\nPersonality: ${f.personality || '[Define 3–5 consistent traits]'}\nClothing / accessories: ${f.clothing || '[Specify fixed clothing or state none]'}\nDistinctive features: ${f.distinctive || '[Specify memorable identifying details]'}\nRelationships: ${f.relationships || '[Establish clear relationships]'}\nConsistency level: ${f.consistency}\nPreserve all customer-supplied names, spellings, traits and choices exactly. Never rename a character or silently change a locked decision.\n\nBOOK AND PRINT SPECIFICATIONS\nTrim size: ${f.bookSize === 'Custom size (describe below)' ? (f.customSize || 'Custom dimensions not yet supplied') : f.bookSize}\nOrientation: ${f.orientation}\nBleed: ${f.bleed}\nSafe margin: ${f.safeMargin}\nText placement: ${f.textPlacement}\nIllustration layout: ${f.illustrationPlacement}\nPage numbering: ${f.pageNumbering}\nPage number position: ${f.pageNumberPosition}\nReserved footer space: ${f.footerSpace}\nTreat the cover as separate, not as an interior story page. ${f.pageNumbering.startsWith('Automatic') ? `Reserve a clean footer zone (${f.footerSpace.toLowerCase()}) at ${f.pageNumberPosition.toLowerCase()} on every interior story page for automatic numbering during final layout. Keep characters, focal action and important objects out of that zone. Never generate page numbers in artwork.` : 'Do not include page numbers or a dedicated numbering footer.'}\nBleed and safe margins must be applied in final layout/export, not merely assumed to exist in image prompts.\n\nILLUSTRATION ART DIRECTION\nStyle: ${f.illustrationStyle}${f.customStyle ? `; additional direction: ${f.customStyle}` : ''}\nColor palette: ${f.palette}\nLighting / atmosphere: ${f.lighting}\nBackground detail: ${f.backgroundDetail}\nComposition: ${f.composition}\nNegative prompt: ${f.negativePrompt}\nUse one cohesive art direction across cover and all interior pages. No unrequested text, letters, words, captions, speech bubbles, logos, watermarks, signatures or page numbers inside illustrations.`;
}
function Field({ label, value, onChange, options, placeholder, multiline = false, hint }) {
  return <label className="ml-field"><span>{label}</span>{options ? <select value={value} onChange={e => onChange(e.target.value)}>{options.map(v => <option key={v}>{v}</option>)}</select> : multiline ? <textarea rows="2" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}{hint && <small>{hint}</small>}</label>;
}
function Section({ number, title, subtitle, children, open = false }) {
  return <details className="ml-form-section" open={open}><summary><span className="ml-section-number">{number}</span><span className="ml-section-title"><strong>{title}</strong><small>{subtitle}</small></span><ChevronDown size={17}/></summary><div className="ml-section-fields">{children}</div></details>;
}

const QUICK_STAGE_LABELS = [
  'Story Concept & Titles',
  'Story Architecture & Character Bible',
  'Complete Manuscript',
  'Page-by-Page Storyboard',
  'Cover & Illustration Prompts',
  'Final Quality Control'
];

function splitQuickPackage(text) {
  if (!text?.trim()) return [];
  const heading = /(?:^|\n)\s{0,3}(?:#{1,6}\s*)?STAGE\s*([1-6])\s*(?:[—–:-]\s*|:\s*)([^\n]*)/gi;
  const matches = [...text.matchAll(heading)];
  if (matches.length < 5) return [];
  return matches.map((match, index) => {
    const start = match.index + (match[0].startsWith('\n') ? 1 : 0);
    const bodyStart = start + match[0].length - (match[0].startsWith('\n') ? 1 : 0);
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const number = Number(match[1]);
    return {
      number,
      title: QUICK_STAGE_LABELS[number - 1] || match[2].trim(),
      content: text.slice(bodyStart, end).trim()
    };
  });
}

function extractIllustrationPrompts(stageText) {
  if (!stageText) return [];
  // Stop the cover card before the next section heading. Some GPT responses
  // place "5.3 Interior illustration prompt library" before the first Page heading.
  const cleanStage = stageText.replace(
    /^\s{0,3}(?:#{1,6}\s*)?5\.3\s+Interior illustration prompt library\s*$/im,
    ''
  );
  const lines = cleanStage.split('\n');
  const starts = [];
  const promptHeading = /^\s{0,3}#{0,4}\s*(Cover(?:\s*[—–:-]\s*.*|\s+illustration prompt)?|Page\s*\d+\s*[:—-].*|Page\s*\d+\s*$)/i;
  lines.forEach((line, index) => {
    if (promptHeading.test(line.trim())) starts.push(index);
  });
  if (!starts.length) return [];
  return starts.map((start, index) => {
    const end = index + 1 < starts.length ? starts[index + 1] : lines.length;
    const title = lines[start].replace(/^\s{0,3}#{0,4}\s*/, '').trim();
    const content = lines.slice(start, end).join('\n').trim();
    return { title, content };
  }).filter(item => item.content.length > 30);
}

export default function StorybookWorkflow() {
  const [form, setForm] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY + '-brief') || '{}'); return { ...defaults, ...saved, pageNumbering: saved.pageNumbering === 'No page numbers' ? 'No page numbers' : 'Automatic numbering', pageNumberPosition: saved.pageNumberPosition || 'Bottom right' }; } catch { return defaults; } });
  const [active, setActive] = useState(0);
  const [creationMode, setCreationMode] = useState('quick');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickResult, setQuickResult] = useState(() => localStorage.getItem(STORAGE_KEY + '-quick-result') || '');
  const [quickReviewOpen, setQuickReviewOpen] = useState(false);
  const [outputs, setOutputs] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY + '-outputs') || '{}'); } catch { return {}; } });
  const [approved, setApproved] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY + '-approved') || '[]'); } catch { return []; } });
  const [copiedKey, setCopiedKey] = useState('');
  const [showBrief, setShowBrief] = useState(true);
  const [showAllNote, setShowAllNote] = useState(false);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY + '-brief', JSON.stringify(form)); localStorage.setItem(STORAGE_KEY + '-outputs', JSON.stringify(outputs)); localStorage.setItem(STORAGE_KEY + '-approved', JSON.stringify(approved)); localStorage.setItem(STORAGE_KEY + '-quick-result', quickResult); } catch {} }, [form, outputs, approved, quickResult]);
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setApproved([]);
    setOutputs(prev => { const next = { ...prev }; Object.keys(next).forEach(k => { if (Number(k) >= 0) delete next[k]; }); return next; });
  };
  const priorStages = stages.slice(0, active).map((s, i) => `\n\nAPPROVED ${s.title.toUpperCase()}\n${outputs[i]?.content || '[This earlier stage has not yet been approved]'}`).join('');
  const prompt = useMemo(() => `${stageInstructions[active]}\n\n${buildBrief(form)}${priorStages}\n\nSTAGE WORKFLOW RULES\nProduce only the requested stage. Use approved prior-stage content as binding context. Preserve all supplied and approved names and decisions exactly. Do not invent contradictions. Clearly label assumptions. Do not continue into later stages. Finish by requesting the creator's review and approval.`, [active, form, outputs]);
  const everythingPrompt = `You are an expert children's picture-book publishing team: author, developmental editor, early-years learning designer, character designer, storyboard artist, illustration art director and print-production quality controller.

TASK
Create ONE COMPLETE SIX-STAGE PRODUCTION PACKAGE for the project brief below. This is Quick Create, so complete all six stages in this single response. Do not stop after Stage 1 and do not ask for approval between stages. Do not provide only Stage 1. Finish by asking the creator to review the complete package.

PROJECT BRIEF
${buildBrief(form)}

PRODUCTION STAGES
STAGE 1 — STORY CONCEPT & TITLES
Provide three distinct age-appropriate title options, recommend one with a brief reason, write a concise synopsis, state the emotional promise, central story question and simple problem the protagonist will solve. Identify assumptions.

STAGE 2 — STORY ARCHITECTURE & CHARACTER BIBLE
Outline the opening, inciting moment, development, climax, resolution and emotional arc. Establish coherent setting geography and reusable landmarks. Define every recurring character's exact name, species, age impression, proportions, face, eyes, colours, markings, clothing/accessories, silhouette, personality, mannerisms and relationships. Include a reusable character-lock paragraph for each. Preserve the supplied character design.

STAGE 3 — COMPLETE MANUSCRIPT
Write EXACTLY ${form.pages === 'Custom length' ? (form.customPages || '20') : (form.pages || '10 story pages').replace(' story pages', '')} numbered interior story pages, excluding the separate cover. For every page provide a short page purpose and final read-aloud text. Keep vocabulary and sentence length appropriate for ${form.age}. Create clear page turns and a satisfying resolution.

STAGE 4 — PAGE-BY-PAGE STORYBOARD
Create exactly one storyboard entry for every manuscript page. Repeat that page's manuscript text VERBATIM. Describe setting, characters, action, emotion, composition, camera angle/distance, foreground, background and focal point. Keep text and footer areas unobstructed. Do not invent story events.

STAGE 5 — COVER & ILLUSTRATION PROMPTS
Provide one separate cover concept and one detailed standalone cover prompt, plus EXACTLY one independent detailed illustration prompt for every interior story page. Repeat relevant character-lock details in each applicable prompt. Keep character designs, geography, time progression, palette and art direction consistent. Each interior illustration must occupy an upper illustration panel within the final page layout, leaving the story text area below. Keep the bottom-right footer zone clear for automatic page numbering during final layout. Specify trim size, orientation, 3 mm bleed and 10 mm safe margin as final-layout requirements. Never generate text, captions, lettering, speech bubbles, logos, watermarks, signatures or page numbers inside artwork. Give cover title placement guidance separately from the image prompt.

STAGE 6 — FINAL QUALITY CONTROL
Audit all six stages. Check exact page count, manuscript/storyboard text matching, character consistency, setting geography, props, time progression, emotional continuity, page-turn flow, resolution, age suitability, grammar, spelling, read-aloud clarity, natural moral, factual accuracy where relevant, separate cover, exactly one illustration prompt per interior page, no unrequested text in artwork, illustration/text layout, bleed, safe margins and automatic bottom-right footer clearance. Return a PASS / NEEDS REVISION checklist with specific stage/page references. Do not silently rewrite approved content.

GLOBAL RULES
- The cover is separate and is never included in the interior page count.
- The manuscript is the single source of truth for the storyboard and illustration prompts.
- Preserve supplied character names and visual traits. Never rename Finnie or change locked design details.
- Correct obvious typing errors in ordinary descriptive text only when the intended word is unambiguous (for example, "curios" to "curious" and "og" to "of"). Never alter names or intended story details.
- Clearly label any creative assumptions.
- Use clear headings and consistent page numbering throughout.
- Complete all six stages in order in this one response. Do not stop at Stage 1.`;

  const quickSections = useMemo(() => splitQuickPackage(quickResult), [quickResult]);
  const illustrationCards = useMemo(() => {
    const illustrationStage = quickSections.find(section => section.number === 5);
    return illustrationStage ? extractIllustrationPrompts(illustrationStage.content) : [];
  }, [quickSections]);
  const current = outputs[active] || { content: '', prompt: '' };
  const updateCurrent = patch => setOutputs(prev => ({ ...prev, [active]: { ...(prev[active] || {}), ...patch } }));
  const copy = async (text, key = 'generic') => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(temp);
        if (!successful) throw new Error('Clipboard copy failed');
      }
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(current => current === key ? '' : current), 2200);
    } catch {
      window.alert('Copy was not completed. Please select the text and copy it manually.');
    }
  };
  const generate = () => { updateCurrent({ prompt }); setCopied(false); };
  const approve = () => { setApproved(prev => prev.includes(active) ? prev : [...prev, active]); if (active < 5) setActive(active + 1); };
  const editStage = index => { setApproved(prev => prev.filter(n => n < index)); setOutputs(prev => { const next = { ...prev }; Object.keys(next).forEach(k => { if (Number(k) >= index) delete next[k]; }); return next; }); setActive(index); };
  const reset = () => { if (window.confirm('Start a new Storybook project? This clears the saved brief and staged content in this browser.')) { setForm(defaults); setOutputs({}); setApproved([]); setActive(0); localStorage.removeItem(STORAGE_KEY + '-brief'); localStorage.removeItem(STORAGE_KEY + '-outputs'); localStorage.removeItem(STORAGE_KEY + '-approved'); } };
  const field = (key, label, options, placeholder, multiline, hint) => <Field key={key} label={label} value={form[key]} onChange={v => update(key, v)} options={options} placeholder={placeholder} multiline={multiline} hint={hint}/>;
  return <div className="ml-storybook-v22">
    <div className="ml-v22-intro"><div><div className="ml-v22-eyebrow">GUIDED BOOK PRODUCTION</div><h2>Let's make a storybook.</h2><p>Choose a simple guided experience or work through each stage yourself.</p></div><button className="ml-v22-plain" onClick={reset}>New project</button></div>
    <section className="ml-mode-picker"><button className={creationMode === 'quick' ? 'selected' : ''} onClick={() => setCreationMode('quick')}><Sparkles size={17}/><span><strong>Quick Create</strong><small>One brief and one complete production package</small></span><em>Beginner friendly</em></button><button className={creationMode === 'guided' ? 'selected' : ''} onClick={() => setCreationMode('guided')}><WandSparkles size={17}/><span><strong>Step-by-Step</strong><small>Review and approve each of the six stages</small></span></button></section>
    <section className="ml-brief-card"><button className="ml-brief-toggle" onClick={() => setShowBrief(v => !v)}><span><strong>01 · Project brief & book settings</strong><small>Enter your story idea, characters, print specifications and illustration direction.</small></span><span className="ml-brief-toggle-right">{showBrief ? 'Collapse' : 'Edit brief'} <ChevronDown size={16}/></span></button>
      {showBrief && <div className="ml-brief-content">
        <Section number="01" title="Story foundation" subtitle="The idea, world, characters and heart of the story" open>
          {field('title','Story idea or working title',null,'e.g. Finnie and the Missing Butterfly')}
          {field('age','Target age',['2–3 years','3–5 years','5–7 years','7–9 years'])}
          {field('pages','Interior story length',['6 story pages','10 story pages','12 story pages','16 story pages','20 story pages','Custom length'])}
          {form.pages === 'Custom length' && <label className="ml-field"><span>Number of story pages</span><input type="number" min="1" max="40" value={form.customPages} onChange={e => update('customPages', e.target.value)} placeholder="e.g. 24"/><small>Enter 1–40 interior pages. The cover is separate.</small></label>}
          {field('theme','Theme or genre',['Animals and friendship','Adventure and exploration','Fairy tales and magic','Everyday life','Bible stories','Learning and discovery','Feelings and growing up','Other (custom)'])}
          {form.theme === 'Other (custom)' && field('customTheme','Your custom theme',null,'Describe your theme')}
          {field('characterType','Main character type',['Friendly animal','Child','Fantasy character','Bible character','Group of friends','Other (custom)'])}
          {form.characterType === 'Other (custom)' && field('customCharacter','Describe your main character',null,'Who should the main character be?')}
          {field('character','Character name or idea (optional)',null,'e.g. Finnie, a curious little fox')}
          {field('supportingCharacters','Supporting characters (optional)',null,'Names, species and brief roles. Leave blank if the AI should decide.',true)}
          {field('setting','Story setting / world',null,'e.g. A sunny woodland with a stream and old oak trees')}
          {field('conflict','Main problem or adventure',null,'What challenge or discovery moves the story forward?',true)}
          {field('lesson','Story lesson',['Kindness and helping others','Friendship and sharing','Courage and confidence','Honesty and responsibility','Patience and perseverance','Faith and gratitude','Curiosity and discovery','Other (custom)'])}
          {form.lesson === 'Other (custom)' && field('customLesson','Your custom lesson',null,'What should children take away from the story?',true)}
          {field('ending','Desired ending',['Hopeful and heartwarming','Funny and joyful','Calm and reassuring','Surprising but satisfying','Open ending for a series'])}
        </Section>
        <Section number="02" title="Story structure" subtitle="Choose the storytelling approach and reading experience">
          {field('storyFormat','Book format',['Standalone story','Part of a series','Series pilot / first book'])}
          {field('narration','Narration style',['Third-person narrator','First-person narrator','Dialogue-led storytelling'])}
          {field('plot','Plot structure',['Problem-solving adventure','Discovery and exploration','Friendship and cooperation','Gentle everyday story','Imaginative fantasy','Cause and effect'])}
          {field('tone','Emotional tone',['Warm and heartwarming','Funny and playful','Exciting and adventurous','Gentle and reassuring','Wonder-filled and magical'])}
          {field('vocabulary','Vocabulary',['Very simple, repetitive words','Simple, familiar vocabulary','Growing vocabulary with context clues','Rich descriptive language'])}
          {field('readingLevel','Reading experience',['Read-aloud','Early independent reader','Shared reading with discussion'])}
          {field('dialogue','Dialogue amount',['Minimal dialogue','Balanced narration and dialogue','Dialogue-rich'])}
        </Section>
        <Section number="03" title="Character development" subtitle="Lock the visual identity and personality of every character">
          {field('appearance','Physical appearance',null,'Fur / skin / hair color, eye color, body shape, size and visible traits.',true)}
          {field('personality','Personality traits',null,'e.g. Curious, thoughtful, brave but sometimes shy')}
          {field('clothing','Clothing and accessories',null,'e.g. A teal scarf worn in every scene')}
          {field('distinctive','Distinctive features',null,'e.g. White tail tip, one small freckle beside the left eye')}
          {field('relationships','Character relationships',null,'How the main character knows and relates to supporting characters.',true)}
          {field('consistency','Character consistency',['Standard consistency','Strict visual consistency','Character locked'])}
        </Section>
        <Section number="04" title="Book and print specifications" subtitle="Set page layout, print margins and numbering">
          {field('bookSize','Book size',['20 × 20 cm square','A4 portrait','A4 landscape','A5 portrait','US Letter portrait','Custom size (describe below)'])}
          {field('customSize','Custom dimensions',null,'e.g. 18 × 18 cm, 2400 × 2400 px at 300 DPI')}
          {field('orientation','Orientation',['Square','Portrait','Landscape'])}
          {field('bleed','Bleed',['None','3 mm','5 mm'])}
          {field('safeMargin','Safe margin',['5 mm','10 mm','12 mm','15 mm'])}
          {field('textPlacement','Text placement',['Text below illustration','Text above illustration','Text beside illustration','Text over clear area of illustration','Separate text page and illustration page'])}
          {field('illustrationPlacement','Illustration layout',['Illustration panel above text area','Half-page illustration','Spot illustrations','Two-page spread','Flexible composition per page'])}
          {field('pageNumbering','Page numbering',['Automatic numbering','No page numbers'])}
          {field('pageNumberPosition','Number position',['Bottom right','Bottom center','Bottom left'])}
          {field('footerSpace','Reserved footer space',['Small','Medium','Large'])}
          <p className="ml-print-note">The cover is separate. Bleed and safe margins must be applied during final page layout/export, not just mentioned in image prompts.</p>
        </Section>
        <Section number="05" title="Illustration direction" subtitle="Choose a visual style and keep artwork cohesive">
          {field('illustrationStyle','Illustration style',['Soft watercolor','3D cartoon','Pastel vector','Colored pencil','Gouache painting','Digital storybook','Custom style'])}
          {field('palette','Color palette',['Warm natural woodland palette','Soft pastel palette','Bright playful primary colors','Earthy muted colors','Cool dreamy palette','Custom palette'])}
          {field('lighting','Lighting and atmosphere',['Soft, gentle natural lighting','Warm golden-hour lighting','Bright cheerful daylight','Dreamy magical glow','Cozy indoor lighting'])}
          {field('backgroundDetail','Background detail',['Simple, minimal backgrounds','Moderate detail, uncluttered','Rich, immersive environments'])}
          {field('composition','Composition guidance',null,'e.g. Clear focal point, expressive faces, varied camera angles.',true)}
          {field('customStyle','Custom illustration style (optional)',null,'Add medium, outline, texture or rendering preferences.',true)}
          {field('negativePrompt','Negative prompt / things to avoid',null,'Things the image model must avoid.',true)}
        </Section>
        <div className="ml-brief-save"><CheckCircle2 size={16}/> Brief saves automatically in this browser. Changing it clears stage approvals and drafts so later prompts cannot rely on outdated details.</div>
      </div>}
    </section>
    {creationMode === 'guided' && <section className="ml-progress-card"><div className="ml-progress-top"><strong>02 · Production progress</strong><span>{approved.length} of 6 stages approved</span></div><div className="ml-progress-track"><span style={{ width: `${approved.length / 6 * 100}%` }}/></div><div className="ml-stage-nav">{stages.map((s,i)=><button key={s.short} className={`ml-stage-chip ${active===i?'active':''} ${approved.includes(i)?'approved':''}`} onClick={() => setActive(i)}><span>{approved.includes(i)?<Check size={13}/>:String(i+1).padStart(2,'0')}</span><small>{s.short}</small></button>)}</div></section>}
    {creationMode === 'quick' ? <section className="ml-quick-card">
      <div className="ml-stage-heading"><div className="ml-stage-number"><Sparkles size={18}/></div><div><div className="ml-v22-eyebrow">QUICK CREATE</div><h3>Your complete storybook package</h3><p>One prompt creates all six stages, including a separate illustration prompt for the cover and every story page.</p></div></div>
      <div className="ml-stage-actions">
        <button className="ml-primary" onClick={() => { setQuickPrompt(everythingPrompt); setCopiedKey(''); }}><WandSparkles size={15}/> Prepare complete prompt</button>
         {quickPrompt && <button className="ml-secondary" onClick={() => copy(quickPrompt, 'quick-prompt')}>{copiedKey === 'quick-prompt' ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy prompt</>}</button>}
      </div>
      {quickPrompt && <textarea className="ml-output-text prompt" readOnly value={quickPrompt}/>}
      {quickPrompt && <div className="ml-output-block ml-quick-result">
        <label className="ml-field"><span>Paste the complete ChatGPT response here</span><textarea className="ml-output-text result" value={quickResult} onChange={e => { setQuickResult(e.target.value); setQuickReviewOpen(false); }} placeholder="After ChatGPT creates all six stages, paste the entire response here..."/></label>
        <div className="ml-stage-actions">
          <button className="ml-primary" disabled={!quickResult.trim()} onClick={() => setQuickReviewOpen(true)}><ClipboardCheck size={15}/> Organise & review package</button>
          {quickResult && <button className="ml-secondary" onClick={() => copy(quickResult, 'full-response')}>{copiedKey === 'full-response' ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy full response</>}</button>}
        </div>
        <div className="ml-quick-note">Your response is saved in this browser. Organising it does not change the original pasted text.</div>
      </div>}
      {quickReviewOpen && quickResult.trim() && <section className="ml-package-review">
        <div className="ml-stage-heading"><div><div className="ml-v22-eyebrow">PACKAGE REVIEW</div><h3>Your six production stages</h3><p>Open a section to review its content. Copy individual illustration prompts from Stage 5.</p></div></div>
        {quickSections.length === 6 ? quickSections.map(section => <details className="ml-package-section" key={section.number}>
          <summary><span className="ml-section-number">{String(section.number).padStart(2,'0')}</span><span className="ml-section-title"><strong>{section.title}</strong><small>{section.number === 5 ? `${illustrationCards.length || 'Page-by-page'} illustration prompt entries` : 'Expand to review this stage'}</small></span><ChevronDown size={17}/></summary>
          <div className="ml-package-section-content">
            <textarea className="ml-output-text result ml-section-edit" value={section.content} readOnly />
            <button className="ml-secondary" onClick={() => copy(section.content, `stage-${section.number}`)}>{copiedKey === `stage-${section.number}` ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy this stage</>}</button>
            {section.number === 5 && <div className="ml-illustration-library">
              <h4>Illustration prompt library</h4>
              <p>Copy each prompt separately when you're ready to create the artwork.</p>
              {illustrationCards.length ? illustrationCards.map((card, index) => <details className="ml-illustration-card" key={`${card.title}-${index}`}>
                <summary><strong>{card.title}</strong><ChevronDown size={15}/></summary>
                <div><textarea className="ml-output-text result" readOnly value={card.content}/><button className={`ml-secondary ${copiedKey === `illustration-${index}` ? "ml-copy-success" : ""}`} onClick={() => copy(card.content, `illustration-${index}`)}>{copiedKey === `illustration-${index}` ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy prompt</>}</button></div>
              </details>) : <p className="ml-parse-note">I couldn't identify separate Cover / Page headings automatically. The full Stage 5 text is still available above to copy. Use headings such as “Cover” and “Page 1: ...” for individual prompt cards.</p>}
            </div>}
          </div>
        </details>) : <div className="ml-parse-warning"><strong>We couldn't reliably identify all six stage headings.</strong><p>Please check that the pasted response includes headings “STAGE 1” through “STAGE 6”. Your original response is safe in the text box above.</p></div>}
        <div className="ml-stage-actions"><button className="ml-secondary" onClick={() => setQuickReviewOpen(false)}>Back to response</button><button className="ml-primary" onClick={() => copy(quickSections.map(section => `STAGE ${section.number} — ${section.title}\n\n${section.content}`).join('\n\n'), 'organised-package')} disabled={quickSections.length !== 6}>{copiedKey === 'organised-package' ? <><Check size={15}/> Copied!</> : <><ClipboardCheck size={15}/> Copy organised package</>}</button></div>
      </section>}
    </section> : <div className="ml-workflow-layout"><section className="ml-stage-card"><div className="ml-stage-heading"><div className="ml-stage-number">{String(active+1).padStart(2,'0')}</div><div><div className="ml-v22-eyebrow">STAGE {active+1} OF 6</div><h3>{stages[active].title}</h3><p>{stages[active].detail}</p></div>{approved.includes(active)&&<span className="ml-approved"><CheckCircle2 size={15}/> Approved</span>}</div>
      <div className="ml-stage-actions"><button className="ml-primary" onClick={generate}><WandSparkles size={15}/> {current.prompt?'Refresh stage prompt':'Generate stage prompt'}</button><button className="ml-secondary" onClick={() => { copy(everythingPrompt); setShowAllNote(true); }}><Sparkles size={15}/> Generate Everything prompt</button></div>
      {current.prompt && <div className="ml-output-block"><div className="ml-output-head"><span><strong>1. Stage prompt</strong><small>Copy this into ChatGPT or your preferred AI tool.</small></span><button onClick={() => copy(current.prompt)}><Copy size={14}/> Copy prompt</button></div><textarea className="ml-output-text prompt" readOnly value={current.prompt}/></div>}
      <div className="ml-output-block"><div className="ml-output-head"><span><strong>2. AI-generated result</strong><small>Paste the response here. Edit it before approving.</small></span><button disabled={!current.content} onClick={() => copy(current.content || '')}><Copy size={14}/> Copy result</button></div><textarea className="ml-output-text result" value={current.content || ''} onChange={e => { const value=e.target.value; setOutputs(prev=>({...prev,[active]:{...(prev[active]||{}),content:value}})); setApproved(prev=>prev.filter(n=>n<active)); setOutputs(prev=>{const next={...prev}; Object.keys(next).forEach(k=>{if(Number(k)>active) delete next[k];}); return next;}); }} placeholder="Paste the AI's response for this stage here. You can edit it before approving..."/></div>
      <div className="ml-stage-footer"><button className="ml-secondary" onClick={() => setActive(Math.max(0,active-1))} disabled={active===0}><ArrowLeft size={14}/> Previous stage</button><div><button className="ml-secondary" onClick={generate}><RefreshCw size={14}/> Refresh prompt</button><button className="ml-primary" onClick={approve} disabled={!current.content?.trim()}><Check size={15}/> {active===5?'Approve final review':'Approve & continue'} <ArrowRight size={14}/></button></div></div>
    </section><aside className="ml-checklist-card"><div className="ml-v22-eyebrow">STAGE CHECKLIST</div><h3>Keep your workflow tidy</h3>{stages.map((s,i)=><button key={s.short} className={`ml-check-row ${active===i?'selected':''}`} onClick={() => setActive(i)}><span className={approved.includes(i)?'done':''}>{approved.includes(i)?<Check size={12}/>:i+1}</span><span><strong>{s.short}</strong><small>{approved.includes(i)?'Approved':outputs[i]?.content?'Draft saved':'Not started'}</small></span><ChevronRight size={14}/></button>)}<div className="ml-workflow-note"><LockKeyhole size={15}/><span>Approving a stage unlocks the next. Editing the brief resets all stages; editing a stage clears its approval and later drafts.</span></div><button className="ml-compiled" onClick={() => copy(stages.map((s,i)=>`\n\n# ${s.title}\n${outputs[i]?.content || '[Not completed]'}`).join(''))}><ClipboardCheck size={15}/> Copy compiled production package</button></aside></div>}
    {showAllNote && <div className="ml-all-note"><FileText size={15}/> The complete six-stage prompt has been copied. It asks the AI to create the entire package in one response.</div>}
  </div>;
}
