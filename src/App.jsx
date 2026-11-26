import { useState } from 'react';
import {
  Sprout, LayoutDashboard, BookOpen, PencilRuler, FolderOpen, Settings,
  Sparkles, ArrowRight, Clock3, WandSparkles, Copy, Check, Menu, X,
  ChevronRight, FileText, Palette, GraduationCap, Heart, Lightbulb
} from 'lucide-react';

const initialProjects = [
  { title: 'Finnie and the Missing Butterfly', type: 'Storybook', date: 'Recent project', color: 'peach' },
  { title: 'Animal Counting: 1–10', type: 'Worksheet', date: 'Sample project', color: 'sage' },
];

function App() {
  const [page, setPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState('prompt');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projects] = useState(initialProjects);
  const [form, setForm] = useState({ title: '', age: '3–5 years', theme: '', character: '', lesson: '', pages: '10 pages', subject: '', activity: 'Tracing', objective: '', difficulty: 'Beginner' });

  const isStory = page === 'storybook';
  const studioTitle = isStory ? 'Storybook Studio' : 'Worksheet Studio';
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const openStudio = (which) => { setPage(which); setMode('prompt'); setGenerated(false); setMobileOpen(false); };
  const go = (destination) => { setPage(destination); setMobileOpen(false); };

  const promptText = isStory
    ? `You are an expert children's picture-book author and educational content designer. Create a production-ready children's storybook using the brief below.\n\nBOOK TITLE / WORKING IDEA: ${form.title || '[Create a suitable title]'}\nTARGET AGE: ${form.age}\nTHEME / GENRE: ${form.theme || '[Choose an engaging theme]'}\nMAIN CHARACTER: ${form.character || '[Invent a memorable child-friendly character]'}\nMORAL / LEARNING MESSAGE: ${form.lesson || '[Suggest an age-appropriate lesson]'}\nSTORY LENGTH: ${form.pages}\n\nDELIVERABLES:\n1. Three title options and a short story concept.\n2. Character Bible with consistent visual traits.\n3. Complete age-appropriate manuscript, divided page by page.\n4. Storyboard describing composition, action, setting and emotion for every page.\n5. A separate detailed illustration prompt for the cover and each story page.\n6. A continuity and quality-control checklist.\n\nKeep language warm, clear, engaging and suitable for the selected age. Ensure the character's appearance remains consistent across all scenes. Do not place unrequested text inside illustrations.`
    : `You are an experienced early-years educator and printable learning-resource designer. Create a classroom-ready worksheet activity based on this brief.\n\nWORKING TITLE: ${form.title || '[Create a suitable title]'}\nTARGET AGE: ${form.age}\nSUBJECT / THEME: ${form.subject || '[Choose a subject]'}\nACTIVITY TYPE: ${form.activity}\nLEARNING OBJECTIVE: ${form.objective || '[Define a measurable learning objective]'}\nDIFFICULTY: ${form.difficulty}\n\nDELIVERABLES:\n1. A clear worksheet title and learning objective.\n2. Student-facing instructions written for the selected age.\n3. Complete activity content with exact questions or tasks.\n4. Layout and illustration guidance for a printable page.\n5. An answer key where applicable.\n6. A quality-control checklist for age suitability, clarity and correctness.\n\nUse simple instructions, generous writing space and developmentally appropriate activities. Do not invent ambiguous answers.`;

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
      {mode === 'ai' ? <div className="coming-panel"><div className="coming-icon"><Sparkles size={27}/></div><div className="eyebrow muted">IN DEVELOPMENT</div><h2>Your creative assistant is on its way.</h2><p>AI Creator will generate storybooks and worksheets directly inside your workspace. We're building the prompt foundation first so the results are structured, consistent and useful.</p><button className="secondary-btn" onClick={() => setMode('prompt')}>Explore Prompt Builder <ArrowRight size={15}/></button></div> : <div className="builder-layout"><section className="panel builder-panel"><div className="builder-heading"><div className={`builder-icon ${isStory ? 'sage' : 'gold'}`}>{isStory ? <BookOpen size={20}/> : <PencilRuler size={20}/>}</div><div><h2>Let's set the scene</h2><p>Tell us a little about what you want to create.</p></div></div><div className="form-grid"><label className="field full"><span>{isStory ? 'Story idea or working title' : 'Worksheet title or topic'}</span><input value={form.title} onChange={e => update('title', e.target.value)} placeholder={isStory ? 'e.g. Finnie and the Missing Butterfly' : 'e.g. My First Animal Counting Worksheet'}/></label><label className="field"><span>Target age</span><select value={form.age} onChange={e => update('age', e.target.value)}><option>2–3 years</option><option>3–5 years</option><option>5–7 years</option><option>7–9 years</option></select></label>{isStory ? <label className="field"><span>Story length</span><select value={form.pages} onChange={e => update('pages', e.target.value)}><option>5 pages</option><option>10 pages</option><option>12 pages</option><option>15 pages</option><option>20 pages</option></select></label> : <label className="field"><span>Difficulty</span><select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>}
          {isStory ? <><label className="field full"><span>Theme or genre</span><input value={form.theme} onChange={e => update('theme', e.target.value)} placeholder="e.g. Woodland animals, friendship and adventure"/></label><label className="field full"><span>Main character</span><input value={form.character} onChange={e => update('character', e.target.value)} placeholder="e.g. Finnie, a curious little fox"/></label><label className="field full"><span>Moral or learning message</span><textarea rows="3" value={form.lesson} onChange={e => update('lesson', e.target.value)} placeholder="e.g. Small acts of kindness can make a big difference."/></label></> : <><label className="field full"><span>Subject or theme</span><input value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="e.g. Farm animals, numbers 1–10"/></label><label className="field"><span>Activity type</span><select value={form.activity} onChange={e => update('activity', e.target.value)}>{['Tracing','Matching','Counting','Coloring','Cut and paste','Sorting','Mazes','Mixed activity pack'].map(v => <option key={v}>{v}</option>)}</select></label><label className="field"><span>Learning objective</span><input value={form.objective} onChange={e => update('objective', e.target.value)} placeholder="e.g. Recognize numbers 1–10"/></label></>}
        </div><div className="builder-footer"><span><Lightbulb size={15}/> You can refine the prompt before using it.</span><button className="primary-btn" onClick={generatePrompt}>Generate prompt <Sparkles size={15}/></button></div></section><aside className="panel output-panel"><div className="output-top"><div className="eyebrow muted">YOUR PROMPT</div><div className="output-status"><span className="status-dot"/> READY WHEN YOU ARE</div></div>{generated ? <><div className="output-ready"><Check size={17}/> Your prompt is ready</div><p className="output-description">Copy this structured brief and paste it into your preferred AI tool.</p><pre className="prompt-preview">{promptText}</pre><button className="primary-btn copy-btn" onClick={copyPrompt}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied!' : 'Copy full prompt'}</button></> : <div className="empty-output"><div className="empty-icon"><FileText size={26}/></div><h3>Your prompt will appear here</h3><p>Complete the brief, then select Generate prompt. We'll turn your ideas into a clear, detailed creative brief.</p><div className="output-hint"><Sparkles size={15}/> Thoughtfully structured for better results</div></div>}</aside></div>}
    </>
  );

  const SimplePage = ({ title, description, children }) => <div className="simple-page"><div className="eyebrow muted">YOUR CREATIVE SPACE</div><h1>{title}</h1><p>{description}</p>{children}</div>;

  return <div className="app-shell"><Sidebar/>{mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}<main className="main-area"><Header/><div className="page-content">{page === 'dashboard' ? <Dashboard/> : page === 'storybook' || page === 'worksheet' ? <Studio()> : page === 'projects' ? <SimplePage title="My Projects" description="Your creative ideas, all in one place."><div className="panel empty-projects"><FolderOpen size={30}/><h3>Your saved projects will live here.</h3><p>Project saving and account sync are part of the next development stage. For now, you can create and copy prompts in either studio.</p><button className="primary-btn" onClick={() => openStudio('storybook')}>Create your first project <ArrowRight size={15}/></button></div></SimplePage> : <SimplePage title="Settings" description="Your workspace preferences."><div className="panel empty-projects"><Settings size={30}/><h3>Guest workspace</h3><p>You can explore the studio without creating an account. Optional accounts and saved preferences will be added in a later release.</p></div></SimplePage>}</div><footer className="footer"><span>© 2026 MiniLearners Creator Studio</span><span>Made for little learners, and the big imaginations behind them. <Heart size={12}/></span></footer></main></div>;
}

export default App;
