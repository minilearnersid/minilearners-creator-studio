import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ClipboardCheck, Copy, FileText } from 'lucide-react';
import './WorksheetPackageReview.css';

const STORAGE_KEY = 'mlcs-worksheet-package-review-v1';
const STAGE_TITLES = [
  'Worksheet Concept',
  'Learning Architecture',
  'Complete Worksheet Content',
  'Page-by-Page Layout & Design',
  'Answer Key & Teacher Notes',
  'Final Quality Control'
];

function splitPackage(source) {
  if (!source?.trim()) return [];
  const re = /(?:^|\n)\s{0,3}(?:#{1,6}\s*)?(?:STAGE\s*)?([1-6])\s*[.:—–-]+\s*([^\n]*)/gi;
  const matches = [...source.matchAll(re)];
  const unique = matches.filter((m, i) => !i || Number(m[1]) !== Number(matches[i - 1][1]));
  if (unique.length !== 6 || unique.some((m, i) => Number(m[1]) !== i + 1)) return [];
  return unique.map((m, i) => {
    const start = m.index + (m[0].startsWith('\n') ? 1 : 0);
    const bodyStart = start + m[0].length - (m[0].startsWith('\n') ? 1 : 0);
    const end = i < 5 ? unique[i + 1].index : source.length;
    return { number: i + 1, title: STAGE_TITLES[i], content: source.slice(bodyStart, end).trim() };
  });
}

function extractPagePrompts(stageText) {
  if (!stageText) return [];
  const lines = stageText.split('\n');
  const heading = /^\s{0,3}(?:#{1,6}\s*)?(?:\*\*)?(?:Page\s*\d+\s*(?:[—–:-]|\s)|Worksheet\s*Page\s*\d+\s*(?:[—–:-]|\s)|Activity\s*\d+\s*(?:[—–:-]|\s)|Illustration\s*Prompt\s*(?:\d+)?\s*(?:[—–:-]|$)).*$/i;
  const starts = [];
  lines.forEach((line, index) => { if (heading.test(line.trim())) starts.push(index); });
  return starts.map((start, i) => {
    const rawTitle = lines[start].trim().replace(/^\s{0,3}#{1,6}\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
    const end = starts[i + 1] ?? lines.length;
    const content = lines.slice(start, end).join('\n').trim();
    return { title: rawTitle, content };
  }).filter(card => card.content.length > 35);
}

export default function WorksheetPackageReview() {
  const [source, setSource] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const sections = useMemo(() => splitPackage(source), [source]);
  const pagePrompts = useMemo(() => extractPagePrompts(sections.find(s => s.number === 4)?.content || ''), [sections]);

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setSource(saved); } catch {}
  }, []);
  useEffect(() => {
    try { if (source) localStorage.setItem(STORAGE_KEY, source); else localStorage.removeItem(STORAGE_KEY); } catch {}
  }, [source]);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(current => current === key ? '' : current), 1800);
    } catch { window.alert('Copy was unavailable. Please select the text and copy it manually.'); }
  };

  return <section className="wsr-panel">
    <div className="wsr-heading"><div className="wsr-icon"><ClipboardCheck size={19}/></div><div><div className="wsr-eyebrow">WORKSHEET PACKAGE</div><h2>Organise & review your package</h2><p>Paste the complete six-stage AI response below. You can review each stage and copy individual page illustration prompts.</p></div></div>
    <label className="wsr-label" htmlFor="wsr-source">AI-generated worksheet response</label>
    <textarea id="wsr-source" className="wsr-source" value={source} onChange={e => { setSource(e.target.value); setReviewOpen(false); }} placeholder="Paste the complete worksheet package here, including STAGE 1 through STAGE 6..." />
    <div className="wsr-toolbar"><span className="wsr-saved"><span/> Your response is saved in this browser. Organising it does not change the original pasted text.</span><button className="wsr-primary" disabled={!source.trim()} onClick={() => setReviewOpen(true)}><ClipboardCheck size={15}/> Organise & review package</button></div>
    {reviewOpen && <div className="wsr-review">
      <div className="wsr-review-heading"><div className="wsr-eyebrow">PACKAGE REVIEW</div><h3>Your six production stages</h3><p>Open a section to review its content. Copy individual illustration prompts from Stage 4.</p></div>
      {sections.length === 6 ? sections.map(section => <details className="wsr-stage" key={section.number}>
        <summary><span className="wsr-number">{String(section.number).padStart(2, '0')}</span><span className="wsr-stage-title"><strong>{section.title}</strong><small>{section.number === 4 ? `${pagePrompts.length || 'Page-by-page'} illustration prompt entries` : 'Expand to review this stage'}</small></span><ChevronDown size={17}/></summary>
        <div className="wsr-stage-body"><textarea className="wsr-stage-content" readOnly value={section.content}/><button className="wsr-secondary" onClick={() => copy(`STAGE ${section.number} — ${section.title}\n\n${section.content}`, `stage-${section.number}`)}>{copiedKey === `stage-${section.number}` ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy this stage</>}</button>
          {section.number === 4 && <div className="wsr-library"><h4>Illustration prompt library</h4><p>Copy each page prompt separately when you're ready to create the artwork.</p>{pagePrompts.length ? pagePrompts.map((card, index) => <details className="wsr-prompt-card" key={`${card.title}-${index}`}><summary><strong>{card.title}</strong><ChevronDown size={15}/></summary><div><textarea readOnly value={card.content}/><button className="wsr-secondary" onClick={() => copy(card.content, `prompt-${index}`)}>{copiedKey === `prompt-${index}` ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy prompt</>}</button></div></details>) : <div className="wsr-note"><FileText size={16}/> Separate page prompts were not detected automatically. The complete Stage 4 text is still available above. Use clear headings such as “Page 1: ...” or “Worksheet Page 1: ...” for individual prompt cards.</div>}</div>}
        </div>
      </details>) : <div className="wsr-warning"><strong>We couldn't reliably identify all six stage headings.</strong><p>Please check that your pasted response includes headings “STAGE 1” through “STAGE 6”. Your original response remains safe in the text box above.</p></div>}
      <div className="wsr-actions"><button className="wsr-secondary" onClick={() => setReviewOpen(false)}>Back to response</button><button className="wsr-primary" disabled={sections.length !== 6} onClick={() => copy(sections.map(s => `STAGE ${s.number} — ${s.title}\n\n${s.content}`).join('\n\n'), 'full-package')}>{copiedKey === 'full-package' ? <><Check size={15}/> Copied!</> : <><ClipboardCheck size={15}/> Copy organised package</>}</button></div>
    </div>}
  </section>;
}
