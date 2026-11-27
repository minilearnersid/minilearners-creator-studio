import { useState } from 'react';
import StorybookWorkflow from '../StorybookWorkflow.jsx';
import {
  Sprout, LayoutDashboard, BookOpen, PencilRuler, FolderOpen, Settings,
  Sparkles, ArrowRight, Clock3, WandSparkles, Copy, Check, Menu, X,
  ChevronRight, FileText, Palette, GraduationCap, Heart, Lightbulb
} from 'lucide-react';

const initialProjects = [
  { title: 'Finnie and the Missing Butterfly', type: 'Storybook', date: 'Recent project', color: 'peach' },
  { title: 'Animal Counting: 1–10', type: 'Worksheet', date: 'Sample project', color: 'sage' },
];

function buildStorybookPrompt(f) {
  const pages = f.pages.replace(' story pages', '');
  return `You are an expert children's picture-book author, early-years learning designer, art director and print-production specialist. Create a coherent, production-ready picture book using the complete brief below. Follow the selected specifications precisely. If a detail is missing, make a thoughtful age-appropriate choice and identify it as an assumption rather than silently changing supplied details.\n\nPROJECT BRIEF\nWorking title: ${f.title || '[Propose an original title]'}\nTarget age: ${f.age}\nStory length: ${pages} interior story pages, plus a separate cover (do not count the cover as a story page)\nTheme / genre: ${f.theme || '[Develop a suitable theme]'}\nMain character: ${f.character || '[Create a memorable protagonist]'}\nSupporting characters: ${f.supportingCharacters || '[Add only if the story needs them]'}\nSetting / world: ${f.setting || '[Create a vivid, coherent setting]'}\nMain problem / adventure: ${f.conflict || '[Create a simple, age-appropriate story problem]'}\nMoral / learning message: ${f.lesson || '[Choose a meaningful, non-preachy lesson]'}\nDesired ending: ${f.ending}\nBook format: ${f.storyFormat}\nNarration: ${f.narration}\nPlot structure: ${f.plot}\nEmotional tone: ${f.tone}\nVocabulary: ${f.vocabulary}\nReading experience: ${f.readingLevel}\nDialogue: ${f.dialogue}\n\nCHARACTER DESIGN AND CONTINUITY\nPhysical appearance: ${f.appearance || '[Define precise, repeatable physical traits]'}\nPersonality: ${f.personality || '[Define 3–5 consistent traits]'}\nClothing / accessories: ${f.clothing || '[Specify fixed clothing or state none]'}\nDistinctive features: ${f.distinctive || '[Specify memorable identifying details]'}\nRelationships: ${f.relationships || '[Establish clear relationships]'}\nConsistency level: ${f.consistency}\nCreate a master Character Bible with fixed species, age impression, proportions, face, eyes, fur/skin/hair colors, markings, clothing, accessories, silhouette, personality and mannerisms. Repeat the relevant fixed traits in every illustration prompt. Do not change a character's design, scale, clothing, markings or accessories between pages unless the manuscript explicitly describes a permanent change.\n\nBOOK AND PRINT SPECIFICATIONS\nTrim size: ${f.bookSize === 'Custom size (describe below)' ? (f.customSize || 'Custom dimensions not specified') : f.bookSize}\nOrientation: ${f.orientation}\nBleed: ${f.bleed}\nSafe margin: ${f.safeMargin}\nText placement: ${f.textPlacement}\nIllustration layout: ${f.illustrationPlacement}\nPage numbering: ${f.pageNumbering}\nPage number position: ${f.pageNumberPosition}\nReserved footer space: ${f.footerSpace}\nTreat the cover as a separate design, not one of the numbered story pages. ${f.pageNumbering.startsWith('Manual') ? `Reserve a clean, uncluttered footer zone (${f.footerSpace.toLowerCase()}) at ${f.pageNumberPosition.toLowerCase()} on every interior story page. Keep characters, important objects, text and focal action out of this reserved zone. Do not draw a page number, placeholder number, numeral, label or decorative mark in the zone.` : f.pageNumbering.startsWith('Automatic') ? 'Add page numbers later during final page layout/export, never inside generated illustrations. Keep a clear, consistent footer area on every interior story page.' : 'Do not include page numbers. No dedicated page-number footer is required.'} Keep all essential content inside the safe margin. Bleed and safe margins are production instructions and must be applied in final page layout/export, not merely assumed to be present in an image prompt.\n\nILLUSTRATION ART DIRECTION\nStyle: ${f.illustrationStyle}${f.customStyle ? `; additional direction: ${f.customStyle}` : ''}\nColor palette: ${f.palette}\nLighting / atmosphere: ${f.lighting}\nBackground detail: ${f.backgroundDetail}\nComposition: ${f.composition}\nNegative prompt: ${f.negativePrompt}\nUse one cohesive art direction across the cover and every story page. Vary camera distance and composition purposefully while maintaining the same visual world. Give characters expressive, readable emotions and child-friendly proportions. No unrequested text, letters, words, captions, speech bubbles, logos, watermarks, signatures or page numbers inside illustrations. If text is required in the book, provide it separately as manuscript copy, never as part of the image prompt.\n\nREQUIRED PRODUCTION PACKAGE\n1. TITLE OPTIONS AND CONCEPT\n   - Provide three distinct, age-appropriate title options.\n   - Recommend one title and explain briefly why it fits.\n   - Write a concise story concept / synopsis and identify the central emotional promise.\n2. STORY ARCHITECTURE\n   - Outline the opening, inciting moment, development, climax, resolution and emotional arc.\n   - Ensure the problem is understandable and solvable for the target age.\n3. CHARACTER BIBLE\n   - Provide a master visual description and personality profile for every recurring character.\n   - Include a concise character-lock paragraph to paste into every image-generation session.\n4. COMPLETE MANUSCRIPT\n   - Write exactly ${pages} numbered interior story pages.\n   - For each page provide: page purpose, exact final read-aloud text, and optional art-only notes.\n   - Keep sentence length, vocabulary, rhythm and emotional intensity suitable for ${f.age}.\n   - Create a clear page-turn reason and avoid repetitive scenes or abrupt transitions.\n   - The manuscript text must be the single source of truth for all later storyboard and illustration sections.\n5. PAGE-BY-PAGE STORYBOARD\n   - For every story page, repeat the exact manuscript text verbatim.\n   - Describe setting, characters present, action, emotion, composition, camera angle / distance, foreground, background and focal point.\n   - Specify where the text area and reserved page-number footer must remain clear.\n6. COVER ART DIRECTION AND PROMPT\n   - Create a separate cover concept and a detailed standalone illustration prompt.\n   - Include title placement guidance separately, but instruct the image model not to render any text.\n   - Do not count the cover as an interior story page.\n7. INDIVIDUAL ILLUSTRATION PROMPTS\n   - Provide exactly one independent, detailed prompt for each of the ${pages} story pages.\n   - Each prompt must restate the relevant character-lock details and describe only the scene for that page.\n   - Keep all visual details consistent with the Character Bible and storyboard.\n   - Include the selected art style, palette, lighting, composition, trim/orientation guidance, text-safe area and footer exclusion zone.\n   - No unrequested text or page numbers inside artwork.\n8. CONTINUITY AND QUALITY-CONTROL CHECKLIST\n   - Check character appearance, clothing, accessories, setting geography, time progression, props, emotional continuity, page-turn flow and story resolution.\n   - Check age suitability, grammar, spelling, readability, factual accuracy where relevant, and that the moral emerges naturally rather than through lecturing.\n   - Verify that every storyboard page matches its manuscript text exactly and every illustration prompt depicts the correct page.\n   - Verify cover is separate, page count is exact, and manual footer space is reserved on interior pages only.\n\nFINAL QUALITY RULES\n- Do not add extra story pages or silently change the requested page count.\n- Do not introduce a new character or important prop without a story reason.\n- Do not contradict the supplied brief.\n- Do not place unrequested text inside illustrations.\n- Make the output practical for a creator to take into illustration, layout and print production.\n- Use clear headings and consistent page labels throughout.`;
}


const worksheetPromptLibrary = [
  { id: 'animal-counting', category: 'Counting & Numbers', title: 'My First Animal Counting Worksheet', age: '3–5 years', subject: 'Farm animals, numbers 1–10', activity: 'Counting', objective: 'Recognize numbers 1–10 and match each number to a quantity', difficulty: 'Beginner', pages: '2 pages', paper: 'A4 portrait' },
  { id: 'alphabet-tracing', category: 'Alphabet & Literacy', title: 'My First Letter Tracing Pack', age: '3–5 years', subject: 'Uppercase letters A–E', activity: 'Tracing', objective: 'Recognize and trace uppercase letters A–E', difficulty: 'Beginner', pages: '5 pages', paper: 'A4 portrait' },
  { id: 'dinosaur-match', category: 'Matching & Puzzles', title: 'Dinosaur Matching Fun', age: '3–5 years', subject: 'Dinosaurs, visual recognition and matching', activity: 'Matching', objective: 'Match identical dinosaur pictures and notice visual details', difficulty: 'Beginner', pages: '2 pages', paper: 'A4 portrait' },
  { id: 'shape-colour', category: 'Shapes & Colours', title: 'Shapes and Colours Around Us', age: '3–5 years', subject: 'Basic shapes and primary colours', activity: 'Coloring', objective: 'Identify circles, squares, triangles and their colours', difficulty: 'Beginner', pages: '3 pages', paper: 'A4 portrait' },
  { id: 'fine-motor', category: 'Fine Motor Skills', title: 'Little Hands Practice Pack', age: '3–5 years', subject: 'Pre-writing lines and pencil control', activity: 'Tracing', objective: 'Develop pencil control by tracing straight, curved and zigzag lines', difficulty: 'Beginner', pages: '4 pages', paper: 'A4 portrait' },
  { id: 'life-cycle', category: 'Science & Nature', title: 'From Caterpillar to Butterfly', age: '5–7 years', subject: 'Butterfly life cycle', activity: 'Matching', objective: 'Sequence and identify the four stages of a butterfly life cycle', difficulty: 'Intermediate', pages: '3 pages', paper: 'A4 portrait' },
  { id: 'bible-kindness', category: 'Bible Learning', title: 'The Good Samaritan: Kindness Activities', age: '5–7 years', subject: 'Bible story, kindness and helping others', activity: 'Mixed activity pack', objective: 'Recall key events and identify kind actions', difficulty: 'Beginner', pages: '4 pages', paper: 'A4 portrait' },
  { id: 'seasonal', category: 'Seasonal Activities', title: 'A Little Christmas Activity Pack', age: '3–5 years', subject: 'Christmas, shapes, counting and patterns', activity: 'Mixed activity pack', objective: 'Practice early counting, visual matching and pattern recognition', difficulty: 'Beginner', pages: '5 pages', paper: 'A4 portrait' },
];

function buildWorksheetPrompt(f) {
  return `You are an experienced early-years educator, curriculum designer and professional printable worksheet designer. Create a complete, accurate and production-ready worksheet package from the brief below. Follow every supplied setting. If a detail is missing, make a sensible age-appropriate choice and clearly identify it as an assumption.

WORKSHEET PROJECT BRIEF
Working title: ${f.title || '[Suggest a suitable title]'}
Target age: ${f.age}
Subject / theme: ${f.subject || '[Suggest a suitable subject or theme]'}
Activity type: ${f.activity}
Learning objective: ${f.objective || '[Define a clear, measurable learning objective]'}
Difficulty: ${f.difficulty}
Number of pages: ${f.worksheetPages || 'Automatic'}
Paper size: ${f.paperSize || 'A4 portrait'}
Visual theme / art direction: ${f.worksheetStyle || 'Cheerful, child-friendly and uncluttered'}

REQUIRED SIX-STAGE WORKSHEET PRODUCTION PACKAGE

STAGE 1: WORKSHEET CONCEPT
- Provide three suitable worksheet title options and recommend one.
- Summarise the concept, theme, target age, learning objective and expected learning outcome.
- State the activity type and the skills children will practice.
- Explain briefly why the activity is appropriate for the selected age.

STAGE 2: LEARNING ARCHITECTURE
- Break the learning objective into clear, age-appropriate skills.
- Define the activity sequence and progression.
- Set the difficulty and any prerequisite skills.
- Ensure the number of activities and cognitive demands are suitable for the target age.
- Avoid unnecessary complexity, excessive instructions or tasks requiring skills beyond the selected age.

STAGE 3: COMPLETE WORKSHEET CONTENT
- Write the exact student-facing title, instructions, questions, labels, tracing content and tasks.
- Organise the content page by page.
- Specify the exact number of items, objects, choices or responses required for every activity.
- Ensure every task has a clear, unambiguous correct answer where an answer is expected.
- Do not use placeholder tasks such as “add some animals” or “draw a few shapes”. Supply the actual content.
- Keep instructions short, concrete and understandable for the target age.
- Do not claim that dotted tracing artwork or illustrations have been created. Describe exactly what must be drawn or typeset.

STAGE 4: PAGE-BY-PAGE LAYOUT AND DESIGN
- Give a separate layout plan for every page.
- Specify the placement of headings, instructions, activity elements, illustrations, response areas and page numbers if needed.
- Include generous writing, colouring, cutting or tracing space appropriate to the activity.
- Specify illustration subjects and exact quantities wherever counting is involved.
- Include paper size, orientation, safe margins and print-friendly background guidance.
- Keep important content away from trim edges and avoid overcrowded pages.
- Provide a separate illustration prompt for each page when illustrations are needed. Prompts must be self-contained and must not ask the image model to render worksheet text unless explicitly required.

STAGE 5: ANSWER KEY AND TEACHER NOTES
- Provide a complete answer key for every activity that has a correct answer.
- Match answer labels and numbering exactly to the worksheet content.
- For open-ended creative activities, state that answers may vary.
- Include concise teacher or parent guidance only where it helps the activity.

STAGE 6: FINAL QUALITY CONTROL
- Verify age suitability, spelling, grammar, clarity and learning-objective alignment.
- Check every count, sequence, question, answer and illustration quantity.
- Check that all answer-key entries match the actual worksheet tasks.
- Check page count, page size, margins, writing space and print readability.
- Identify any assumptions or items that need a human review before publication.
- End with a concise pass / needs-review checklist. Never mark a check as passed unless it has actually been verified.

GLOBAL QUALITY RULES
- Produce actual worksheet content, not merely a description of a worksheet.
- Never invent ambiguous answers or inconsistent quantities.
- Keep the visual direction cohesive across all pages.
- Use developmentally appropriate activities and simple language.
- Keep the final package organised under the six stage headings above.
- Do not claim that a finished PDF or illustrated worksheet file exists. This deliverable is the complete content and production specification for creating it.`;
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState('prompt');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [randomIdea, setRandomIdea] = useState(null);
  const [selectedLibraryIdea, setSelectedLibraryIdea] = useState('');
  const [projects] = useState(initialProjects);
  const [form, setForm] = useState({
    title: '', age: '3–5 years', theme: '', character: '', lesson: '', pages: '10 story pages',
    supportingCharacters: '', setting: '', conflict: '', ending: 'Hopeful and heartwarming',
    storyFormat: 'Standalone story', narration: 'Third-person narrator', plot: 'Problem-solving adventure',
    tone: 'Warm and heartwarming', vocabulary: 'Simple, familiar vocabulary', readingLevel: 'Read-aloud', dialogue: 'Balanced narration and dialogue',
    appearance: '', personality: '', clothing: '', distinctive: '', relationships: '',
    bookSize: '20 × 20 cm square', customSize: '', orientation: 'Square', textPlacement: 'Text below illustration', illustrationPlacement: 'One full-page illustration per story page',
    bleed: '3 mm', safeMargin: '10 mm', pageNumbering: 'Manual (leave blank space)', pageNumberPosition: 'Bottom center', footerSpace: 'Small',
    illustrationStyle: 'Soft watercolor', palette: 'Warm natural woodland palette', lighting: 'Soft, gentle natural lighting', consistency: 'Character locked', backgroundDetail: 'Moderate detail, uncluttered', composition: 'Clear focal point with child-friendly framing', customStyle: '', negativePrompt: 'No extra characters, no inconsistent clothing, no distorted anatomy, no watermarks, no logos, no unrequested lettering or text.',
    subject: '', activity: 'Tracing', objective: '', difficulty: 'Beginner', worksheetPages: 'Automatic', paperSize: 'A4 portrait', worksheetStyle: 'Cheerful, child-friendly and uncluttered'
  });

  const isStory = page === 'storybook';
  const studioTitle = isStory ? 'Storybook Studio' : 'Worksheet Studio';
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const openStudio = (which) => { setPage(which); setMode('prompt'); setGenerated(false); setMobileOpen(false); };
  const go = (destination) => { setPage(destination); setMobileOpen(false); };
  const useWorksheetIdea = (idea) => {
    setSelectedLibraryIdea(idea.id);
    setForm(current => ({ ...current, title: idea.title, age: idea.age, subject: idea.subject, activity: idea.activity, objective: idea.objective, difficulty: idea.difficulty, worksheetPages: idea.pages, paperSize: idea.paper }));
    setRandomIdea(idea);
    setGenerated(false);
  };
  const suggestRandomWorksheetIdea = () => {
    const available = worksheetPromptLibrary.filter(idea => idea.id !== randomIdea?.id);
    const next = available[Math.floor(Math.random() * available.length)];
    setRandomIdea(next);
  };

  const promptText = isStory
    ? buildStorybookPrompt(form)
    : buildWorksheetPrompt(form);

  const generatePrompt = () => { setGenerated(true); setCopied(false); };
  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(promptText); setCopied(true); }
    catch { setCopied(false); window.alert('Please select and copy the prompt manually.'); }
  };

  const Sidebar = () => (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-lockup">
        <div className="brand-mark"><Sprout size={23} /></div>
        <div><div className="brand-name">MiniLearners</div><div className="brand-sub">CREATOR STUDIO</div></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button>
      </div>
      <div className="nav-label">WORKSPACE</div>
      <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => go('dashboard')}><LayoutDashboard size={18}/> Dashboard</button>
      <div className="nav-label nav-label-spaced">CREATE</div>
      <button className={`nav-item ${page === 'storybook' ? 'active' : ''}`} onClick={() => openStudio('storybook')}><BookOpen size={18}/> Storybook Studio</button>
      <button className={`nav-item ${page === 'worksheet' ? 'active' : ''}`} onClick={() => openStudio('worksheet')}><PencilRuler size={18}/> Worksheet Studio</button>
      <button className={`nav-item ${page === 'projects' ? 'active' : ''}`} onClick={() => go('projects')}><FolderOpen size={18}/> My Projects</button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><Lightbulb size={17}/></div><strong>A little inspiration</strong><p>Small ideas can grow into wonderful learning adventures.</p></div>
        <button className="nav-item" onClick={() => go('settings')}><Settings size={18}/> Settings</button>
        <div className="profile-row"><div className="avatar">ML</div><div><strong>Guest Creator</strong><span>Exploring the studio</span></div><span className="guest-pill">GUEST</span></div>
      </div>
    </aside>
  );

  const Header = () => (
    <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">MiniLearners <ChevronRight size={14}/> <span>{page === 'dashboard' ? 'Dashboard' : page === 'projects' ? 'My Projects' : page === 'settings' ? 'Settings' : studioTitle}</span></div><div className="topbar-right"><span className="guest-label">Guest workspace</span><div className="avatar small">ML</div></div></header>
  );

  const Dashboard = () => (
    <>
      <section className="welcome-banner">
        <div className="welcome-copy"><div className="eyebrow"><Sparkles size={14}/> YOUR CREATIVE SPACE</div><h1>Big ideas start<br/>with little learners.</h1><p>Turn your imagination into meaningful stories and playful learning activities.</p><button className="primary-btn" onClick={() => openStudio('storybook')}>Start creating <ArrowRight size={16}/></button></div>
        <div className="welcome-art"><div className="art-sun"/><div className="art-book"><BookOpen size={78} strokeWidth={1.15}/><span>Imagine<br/>& learn</span></div><div className="art-spark spark-one">✳</div><div className="art-spark spark-two">✦</div><div className="art-leaf">✿</div></div>
      </section>
      <div className="section-heading"><div><div className="eyebrow muted">CHOOSE YOUR CREATIVE TOOL</div><h2>What shall we make today?</h2></div></div>
      <div className="studio-grid">
        <button className="studio-card story-card" onClick={() => openStudio('storybook')}><div className="card-illustration story-illustration"><div className="mini-book"><span>Once upon<br/>a time...</span><BookOpen size={39}/></div><span className="floating-star">✦</span><span className="floating-flower">✿</span></div><div className="card-content"><div className="card-kicker">IMAGINE & TELL</div><h3>Storybook Studio</h3><p>Build magical stories, memorable characters and illustration prompts.</p><span className="card-link">Open Storybook Studio <ArrowRight size={15}/></span></div></button>
        <button className="studio-card worksheet-card" onClick={() => openStudio('worksheet')}><div className="card-illustration worksheet-illustration"><div className="worksheet-paper"><div className="paper-line long"/><div className="paper-line"/><div className="paper-circle">A</div><div className="paper-line short"/><div className="paper-check">✓</div></div><span className="floating-pencil">✎</span><span className="floating-dot">✦</span></div><div className="card-content"><div className="card-kicker">PLAY & DISCOVER</div><h3>Worksheet Studio</h3><p>Design engaging worksheets, printable activities and learning packs.</p><span className="card-link">Open Worksheet Studio <ArrowRight size={15}/></span></div></button>
      </div>
      <div className="lower-grid"><section className="panel recent-panel"><div className="panel-heading"><div><div className="eyebrow muted">YOUR WORKSPACE</div><h2>Recent projects</h2></div><button className="text-btn" onClick={() => go('projects')}>View all <ArrowRight size={14}/></button></div><div className="project-list">{projects.map((project, i) => <div className="project-row" key={project.title}><div className={`project-icon ${project.color}`}>{i === 0 ? <BookOpen size={19}/> : <PencilRuler size={19}/>}</div><div className="project-info"><strong>{project.title}</strong><span>{project.type} · {project.date}</span></div><button className="more-btn" onClick={() => openStudio(i === 0 ? 'storybook' : 'worksheet')}>Open <ChevronRight size={15}/></button></div>)}</div></section><section className="panel tip-panel"><div className="tip-icon"><Heart size={20}/></div><div className="eyebrow muted">A CREATOR'S NOTE</div><h3>Make room for wonder.</h3><p>The best learning resources start with one thoughtful question: what would make a child curious?</p><span className="tip-decoration">✳</span></section></div>
    </>
  );

  const Studio = () => (
    <>
      <div className="studio-page-intro"><div className="eyebrow muted">CREATE SOMETHING WONDERFUL</div><h1>{studioTitle}</h1><p>{isStory ? 'Turn a little idea into a story worth remembering.' : 'Make playful, purposeful activities that help little minds grow.'}</p></div>
      <div className="mode-switch"><button className={mode === 'prompt' ? 'selected' : ''} onClick={() => {setMode('prompt');setGenerated(false)}}><WandSparkles size={16}/> Prompt Builder <span className="mode-tag">START HERE</span></button><button className={mode === 'ai' ? 'selected' : ''} onClick={() => {setMode('ai');setGenerated(false)}}><Sparkles size={16}/> AI Creator <span className="soon-tag">COMING NEXT</span></button></div>
      {mode === 'ai' ? <div className="coming-panel"><div className="coming-icon"><Sparkles size={27}/></div><div className="eyebrow muted">IN DEVELOPMENT</div><h2>Your creative assistant is on its way.</h2><p>AI Creator will generate storybooks and worksheets directly inside your workspace. We're building the prompt foundation first so the results are structured, consistent and useful.</p><button className="secondary-btn" onClick={() => setMode('prompt')}>Explore Prompt Builder <ArrowRight size={15}/></button></div> : <div className="builder-layout"><section className="panel builder-panel"><div className="builder-heading"><div className={`builder-icon ${isStory ? 'sage' : 'gold'}`}>{isStory ? <BookOpen size={20}/> : <PencilRuler size={20}/>}</div><div><h2>Let's set the scene</h2><p>Tell us a little about what you want to create.</p></div></div>{isStory ? <div className="story-form-sections">
          <details className="form-section" open><summary><span className="section-number">01</span><span><strong>Story foundation</strong><small>The idea, world, characters and heart of the story</small></span></summary><div className="section-fields">
            <label className="field full"><span>Story idea or working title</span><input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Finnie and the Missing Butterfly"/></label>
            <label className="field"><span>Target age</span><select value={form.age} onChange={e => update('age', e.target.value)}><option>2–3 years</option><option>3–5 years</option><option>5–7 years</option><option>7–9 years</option></select></label>
            <label className="field"><span>Story length</span><select value={form.pages} onChange={e => update('pages', e.target.value)}><option>5 story pages</option><option>8 story pages</option><option>10 story pages</option><option>12 story pages</option><option>15 story pages</option><option>20 story pages</option></select></label>
            <label className="field full"><span>Theme or genre</span><input value={form.theme} onChange={e => update('theme', e.target.value)} placeholder="e.g. Friendship, woodland animals and adventure"/></label>
            <label className="field full"><span>Main character</span><input value={form.character} onChange={e => update('character', e.target.value)} placeholder="e.g. Foxy, a curious little fox"/></label>
            <label className="field full"><span>Supporting characters <em>Optional</em></span><textarea rows="2" value={form.supportingCharacters} onChange={e => update('supportingCharacters', e.target.value)} placeholder="Names, species and brief roles of friends or helpers"/></label>
            <label className="field full"><span>Story setting / world</span><input value={form.setting} onChange={e => update('setting', e.target.value)} placeholder="e.g. A sunny woodland with a stream and old oak trees"/></label>
            <label className="field full"><span>Main problem or adventure</span><textarea rows="2" value={form.conflict} onChange={e => update('conflict', e.target.value)} placeholder="What challenge, mystery or discovery moves the story forward?"/></label>
            <label className="field full"><span>Moral or learning message</span><textarea rows="2" value={form.lesson} onChange={e => update('lesson', e.target.value)} placeholder="e.g. Small acts of kindness can make a big difference."/></label>
            <label className="field full"><span>Desired ending</span><select value={form.ending} onChange={e => update('ending', e.target.value)}><option>Hopeful and heartwarming</option><option>Funny and joyful</option><option>Calm and reassuring</option><option>Surprising but satisfying</option><option>Open ending for a series</option></select></label>
          </div></details>
          <details className="form-section"><summary><span className="section-number">02</span><span><strong>Story structure</strong><small>Choose the storytelling approach and reading experience</small></span></summary><div className="section-fields">
            <label className="field"><span>Book format</span><select value={form.storyFormat} onChange={e => update('storyFormat', e.target.value)}><option>Standalone story</option><option>Part of a series</option><option>Series pilot / first book</option></select></label>
            <label className="field"><span>Narration style</span><select value={form.narration} onChange={e => update('narration', e.target.value)}><option>Third-person narrator</option><option>First-person narrator</option><option>Dialogue-led storytelling</option></select></label>
            <label className="field"><span>Plot structure</span><select value={form.plot} onChange={e => update('plot', e.target.value)}><option>Problem-solving adventure</option><option>Discovery and exploration</option><option>Friendship and cooperation</option><option>Gentle everyday story</option><option>Imaginative fantasy</option><option>Cause and effect</option></select></label>
            <label className="field"><span>Emotional tone</span><select value={form.tone} onChange={e => update('tone', e.target.value)}><option>Warm and heartwarming</option><option>Funny and playful</option><option>Exciting and adventurous</option><option>Gentle and reassuring</option><option>Wonder-filled and magical</option></select></label>
            <label className="field"><span>Vocabulary</span><select value={form.vocabulary} onChange={e => update('vocabulary', e.target.value)}><option>Very simple, repetitive words</option><option>Simple, familiar vocabulary</option><option>Growing vocabulary with context clues</option><option>Rich descriptive language</option></select></label>
            <label className="field"><span>Reading experience</span><select value={form.readingLevel} onChange={e => update('readingLevel', e.target.value)}><option>Read-aloud</option><option>Early independent reader</option><option>Shared reading with discussion</option></select></label>
            <label className="field"><span>Dialogue amount</span><select value={form.dialogue} onChange={e => update('dialogue', e.target.value)}><option>Minimal dialogue</option><option>Balanced narration and dialogue</option><option>Dialogue-rich</option></select></label>
          </div></details>
          <details className="form-section"><summary><span className="section-number">03</span><span><strong>Character development</strong><small>Lock the visual identity and personality of each character</small></span></summary><div className="section-fields">
            <label className="field full"><span>Physical appearance</span><textarea rows="2" value={form.appearance} onChange={e => update('appearance', e.target.value)} placeholder="Fur / skin / hair color, eye color, body shape, size and other visible traits"/></label>
            <label className="field full"><span>Personality traits</span><input value={form.personality} onChange={e => update('personality', e.target.value)} placeholder="e.g. Curious, thoughtful, brave but sometimes shy"/></label>
            <label className="field full"><span>Clothing and accessories</span><input value={form.clothing} onChange={e => update('clothing', e.target.value)} placeholder="e.g. Teal scarf tied around the neck in every scene"/></label>
            <label className="field full"><span>Distinctive features</span><input value={form.distinctive} onChange={e => update('distinctive', e.target.value)} placeholder="e.g. White tail tip, one small freckle beside the left eye"/></label>
            <label className="field full"><span>Character relationships</span><textarea rows="2" value={form.relationships} onChange={e => update('relationships', e.target.value)} placeholder="How the main character knows and relates to supporting characters"/></label>
            <label className="field full"><span>Character consistency</span><select value={form.consistency} onChange={e => update('consistency', e.target.value)}><option>Standard consistency</option><option>Strict visual consistency</option><option>Character locked: repeat exact master description</option></select></label>
          </div></details>
          <details className="form-section"><summary><span className="section-number">04</span><span><strong>Book and print specifications</strong><small>Set page layout, print margins and numbering</small></span></summary><div className="section-fields">
            <label className="field"><span>Book size</span><select value={form.bookSize} onChange={e => update('bookSize', e.target.value)}><option>20 × 20 cm square</option><option>A4 portrait</option><option>A4 landscape</option><option>A5 portrait</option><option>US Letter portrait</option><option>Custom size (describe below)</option></select></label>
            <label className="field full"><span>Custom dimensions <em>Only if custom size selected</em></span><input value={form.customSize} onChange={e => update('customSize', e.target.value)} placeholder="e.g. 18 × 18 cm, 2400 × 2400 px at 300 DPI"/></label>
            <label className="field"><span>Orientation</span><select value={form.orientation} onChange={e => update('orientation', e.target.value)}><option>Square</option><option>Portrait</option><option>Landscape</option></select></label>
            <label className="field"><span>Bleed</span><select value={form.bleed} onChange={e => update('bleed', e.target.value)}><option>None</option><option>3 mm</option><option>5 mm</option></select></label>
            <label className="field"><span>Safe margin</span><select value={form.safeMargin} onChange={e => update('safeMargin', e.target.value)}><option>5 mm</option><option>10 mm</option><option>12 mm</option><option>15 mm</option></select></label>
            <label className="field"><span>Text placement</span><select value={form.textPlacement} onChange={e => update('textPlacement', e.target.value)}><option>Text below illustration</option><option>Text above illustration</option><option>Text beside illustration</option><option>Text over clear area of illustration</option><option>Separate text page and illustration page</option></select></label>
            <label className="field"><span>Illustration layout</span><select value={form.illustrationPlacement} onChange={e => update('illustrationPlacement', e.target.value)}><option>One full-page illustration per story page</option><option>Half-page illustration</option><option>Spot illustrations</option><option>Two-page spread</option><option>Flexible composition per page</option></select></label>
            <label className="field"><span>Page numbering</span><select value={form.pageNumbering} onChange={e => update('pageNumbering', e.target.value)}><option>Manual (leave blank space)</option><option>Automatic numbering</option><option>No page numbers</option></select></label>
            <label className="field"><span>Number position</span><select value={form.pageNumberPosition} onChange={e => update('pageNumberPosition', e.target.value)}><option>Bottom center</option><option>Bottom left</option><option>Bottom right</option></select></label>
            <label className="field"><span>Reserved footer space</span><select value={form.footerSpace} onChange={e => update('footerSpace', e.target.value)}><option>Small</option><option>Medium</option><option>Large</option></select></label>
          </div><p className="field-note">The cover is treated separately. Manual numbering reserves a clear footer area on interior story pages. Final bleed and safe margins must also be applied during page layout/export.</p></details>
          <details className="form-section"><summary><span className="section-number">05</span><span><strong>Illustration direction</strong><small>Choose a visual style and keep the artwork cohesive</small></span></summary><div className="section-fields">
            <label className="field"><span>Illustration style</span><select value={form.illustrationStyle} onChange={e => update('illustrationStyle', e.target.value)}><option>Soft watercolor</option><option>3D cartoon</option><option>Pastel vector</option><option>Colored pencil</option><option>Gouache painting</option><option>Digital storybook</option><option>Custom style</option></select></label>
            <label className="field"><span>Color palette</span><select value={form.palette} onChange={e => update('palette', e.target.value)}><option>Warm natural woodland palette</option><option>Soft pastel palette</option><option>Bright playful primary colors</option><option>Earthy muted colors</option><option>Cool dreamy palette</option><option>Custom palette</option></select></label>
            <label className="field"><span>Lighting and atmosphere</span><select value={form.lighting} onChange={e => update('lighting', e.target.value)}><option>Soft, gentle natural lighting</option><option>Warm golden-hour lighting</option><option>Bright cheerful daylight</option><option>Dreamy magical glow</option><option>Cozy indoor lighting</option></select></label>
            <label className="field"><span>Background detail</span><select value={form.backgroundDetail} onChange={e => update('backgroundDetail', e.target.value)}><option>Simple, minimal backgrounds</option><option>Moderate detail, uncluttered</option><option>Rich, immersive environments</option></select></label>
            <label className="field full"><span>Composition guidance</span><textarea rows="2" value={form.composition} onChange={e => update('composition', e.target.value)} placeholder="e.g. Clear focal point, expressive faces, varied camera angles and child-friendly framing"/></label>
            <label className="field full"><span>Custom illustration style <em>Optional</em></span><textarea rows="2" value={form.customStyle} onChange={e => update('customStyle', e.target.value)} placeholder="Add any specific medium, outline, texture or rendering preferences"/></label>
            <label className="field full"><span>Negative prompt / things to avoid</span><textarea rows="2" value={form.negativePrompt} onChange={e => update('negativePrompt', e.target.value)}/></label>
          </div></details>
          <details className="form-section"><summary><span className="section-number">06</span><span><strong>Production deliverables</strong><small>Choose a complete, consistent book-production package</small></span></summary><div className="deliverable-list">
            {['Three title options and story concept','Story architecture: beginning, development, climax and resolution','Character Bible with master visual descriptions','Complete manuscript with exact page-by-page text','Storyboard for every page: composition, action, setting and emotion','Separate detailed cover illustration prompt','One independent illustration prompt for every story page','Reusable character-lock instructions and negative prompt','Continuity, age-suitability and production quality-control checklist'].map(item => <div className="deliverable-item" key={item}><span className="deliverable-check">✓</span><span>{item}</span></div>)}
          </div></details>
        </div> : <>
          <style>{`
            .prompt-library-panel { margin-bottom: 18px; padding: 22px; }
            .random-idea-card { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:18px; margin:16px 0; border:1px solid #dfe8dc; border-radius:14px; background:#f6f8f3; }
            .random-idea-copy { min-width:0; flex:1; }
            .random-idea-copy h3 { margin:6px 0; }
            .random-idea-copy p { margin:0; color:#68736a; }
            .random-idea-result { display:flex; flex-direction:column; gap:4px; margin-top:12px; padding:12px; border-radius:10px; background:#fff; border:1px solid #e3e9df; }
            .random-idea-result span,.random-idea-result small { color:#68736a; }
            .random-idea-actions { display:flex; flex-direction:column; align-items:stretch; gap:8px; flex-shrink:0; }
            .library-heading { display:flex; justify-content:space-between; gap:12px; margin:18px 0 10px; }
            .library-heading span { color:#788078; }
            .library-dropdown-field { max-width:100%; margin-top:12px; }
            .library-dropdown-field select { width:100%; }
            .worksheet-brief-grid { margin-top:20px; }
            .worksheet-brief-grid h3 { margin:5px 0 0; }
            @media(max-width:700px) {
              .random-idea-card { align-items:stretch; flex-direction:column; }
              .random-idea-actions { flex-direction:row; flex-wrap:wrap; }
              .library-heading { flex-direction:column; gap:3px; }
            }
          `}</style>
          <section className="panel prompt-library-panel">
            <div className="panel-heading">
              <div><div className="eyebrow muted">START WITH AN IDEA</div><h2>Worksheet Prompt Library</h2></div>
              <span className="mode-tag">READY-MADE IDEAS</span>
            </div>
            <div className="random-idea-card">
              <div className="random-idea-copy"><div className="eyebrow muted">NEED A LITTLE INSPIRATION?</div><h3>Random Worksheet Idea</h3><p>Let MiniLearners suggest an educational activity. You can try another idea or use it to fill in your brief.</p>
                {randomIdea && <div className="random-idea-result"><strong>{randomIdea.title}</strong><span>{randomIdea.category} · {randomIdea.age} · {randomIdea.activity}</span><small>{randomIdea.objective}</small></div>}
              </div>
              <div className="random-idea-actions"><button className="secondary-btn" type="button" onClick={suggestRandomWorksheetIdea}><WandSparkles size={15}/> {randomIdea ? 'Try another idea' : 'Surprise me!'}</button>{randomIdea && <button className="text-btn" type="button" onClick={() => useWorksheetIdea(randomIdea)}>Use this idea <ArrowRight size={14}/></button>}</div>
            </div>
            <div className="library-heading"><strong>Browse ready-made prompts</strong><span>Select a template to pre-fill your brief</span></div>
            <label className="field library-dropdown-field">
              <span>Choose a worksheet prompt</span>
              <select value={selectedLibraryIdea} onChange={e => {
                const idea = worksheetPromptLibrary.find(item => item.id === e.target.value);
                if (idea) useWorksheetIdea(idea);
              }}>
                <option value="">Select a ready-made prompt...</option>
                <optgroup label="Counting & Numbers"><option value="animal-counting">My First Animal Counting Worksheet</option></optgroup>
                <optgroup label="Alphabet & Literacy"><option value="alphabet-tracing">My First Letter Tracing Pack</option></optgroup>
                <optgroup label="Matching & Puzzles"><option value="dinosaur-match">Dinosaur Matching Fun</option></optgroup>
                <optgroup label="Shapes & Colours"><option value="shape-colour">Shapes and Colours Around Us</option></optgroup>
                <optgroup label="Fine Motor Skills"><option value="fine-motor">Little Hands Practice Pack</option></optgroup>
                <optgroup label="Science & Nature"><option value="life-cycle">From Caterpillar to Butterfly</option></optgroup>
                <optgroup label="Bible Learning"><option value="bible-kindness">The Good Samaritan: Kindness Activities</option></optgroup>
                <optgroup label="Seasonal Activities"><option value="seasonal">A Little Christmas Activity Pack</option></optgroup>
              </select>
            </label>
          </section>
          <div className="form-grid worksheet-brief-grid">
            <div className="field full"><div className="eyebrow muted">CUSTOMISE YOUR PROJECT</div><h3>Worksheet brief</h3><p className="field-note">Start with a library idea or create your own. You can edit every field.</p></div>
            <label className="field full"><span>Worksheet title or topic</span><input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. My First Animal Counting Worksheet"/></label>
            <label className="field"><span>Target age</span><select value={form.age} onChange={e => update('age', e.target.value)}><option>2–3 years</option><option>3–5 years</option><option>5–7 years</option><option>7–9 years</option><option>9–12 years</option></select></label>
            <label className="field"><span>Difficulty</span><select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
            <label className="field full"><span>Subject or theme</span><input value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="e.g. Farm animals, numbers 1–10"/></label>
            <label className="field"><span>Activity type</span><select value={form.activity} onChange={e => update('activity', e.target.value)}>{['Tracing','Matching','Counting','Coloring','Cut and paste','Sorting','Mazes','Patterns','Phonics','Writing','Mixed activity pack'].map(v => <option key={v}>{v}</option>)}</select></label>
            <label className="field"><span>Learning objective</span><input value={form.objective} onChange={e => update('objective', e.target.value)} placeholder="e.g. Recognize and trace numbers 1–10"/></label>
            <label className="field"><span>Number of pages</span><select value={form.worksheetPages} onChange={e => update('worksheetPages', e.target.value)}><option>Automatic</option><option>1 page</option><option>2 pages</option><option>3 pages</option><option>4 pages</option><option>5 pages</option><option>6 pages</option><option>10 pages</option><option>Custom (specify in theme)</option></select></label>
            <label className="field"><span>Paper size</span><select value={form.paperSize} onChange={e => update('paperSize', e.target.value)}><option>A4 portrait</option><option>A4 landscape</option><option>A5 portrait</option><option>US Letter portrait</option><option>US Letter landscape</option></select></label>
            <label className="field full"><span>Visual theme or art direction</span><input value={form.worksheetStyle} onChange={e => update('worksheetStyle', e.target.value)} placeholder="e.g. Soft pastel farm illustrations, clean white background"/></label>
          </div>
        </>}<div className="builder-footer"><span><Lightbulb size={15}/> You can refine the prompt before using it.</span><button className="primary-btn" onClick={generatePrompt}>{isStory ? "Generate prompt" : "Quick Create"} <Sparkles size={15}/></button></div></section><aside className="panel output-panel"><div className="output-top"><div className="eyebrow muted">YOUR PROMPT</div><div className="output-status"><span className="status-dot"/> READY WHEN YOU ARE</div></div>{generated ? <><div className="output-ready"><Check size={17}/> Your prompt is ready</div><p className="output-description">{isStory ? "Copy this structured brief and paste it into your preferred AI tool." : "Your six-stage worksheet production prompt is ready. Copy it into your preferred AI tool to generate the complete package."}</p><pre className="prompt-preview">{promptText}</pre><button className="primary-btn copy-btn" onClick={copyPrompt}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied!' : 'Copy full prompt'}</button></> : <div className="empty-output"><div className="empty-icon"><FileText size={26}/></div><h3>Your prompt will appear here</h3><p>Complete the brief, then select {isStory ? 'Generate prompt' : 'Quick Create'}. We'll prepare a structured production prompt for you.</p><div className="output-hint"><Sparkles size={15}/> Thoughtfully structured for better results</div></div>}</aside></div>}
    </>
  );

  const SimplePage = ({ title, description, children }) => <div className="simple-page"><div className="eyebrow muted">YOUR CREATIVE SPACE</div><h1>{title}</h1><p>{description}</p>{children}</div>;

  return <div className="app-shell"><Sidebar/>{mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}<main className="main-area"><Header/><div className="page-content">{page === 'dashboard' ? <Dashboard/> : page === 'storybook' ? <StorybookWorkflow form={form}/> : page === 'worksheet' ? Studio() : page === 'projects' ? <SimplePage title="My Projects" description="Your creative ideas, all in one place."><div className="panel empty-projects"><FolderOpen size={30}/><h3>Your saved projects will live here.</h3><p>Project saving and account sync are part of the next development stage. For now, you can create and copy prompts in either studio.</p><button className="primary-btn" onClick={() => openStudio('storybook')}>Create your first project <ArrowRight size={15}/></button></div></SimplePage> : <SimplePage title="Settings" description="Your workspace preferences."><div className="panel empty-projects"><Settings size={30}/><h3>Guest workspace</h3><p>You can explore the studio without creating an account. Optional accounts and saved preferences will be added in a later release.</p></div></SimplePage>}</div><footer className="footer"><span>© 2026 MiniLearners Creator Studio</span><span>Made for little learners, and the big imaginations behind them. <Heart size={12}/></span></footer></main></div>;
}

export default App;
