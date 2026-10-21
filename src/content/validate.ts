import {bundleSchema,type ContentBundle} from './schema';
export type Issue={severity:'error'|'warning';code:string;path:string;message:string};
export type Validation={ok:boolean;issues:Issue[];bundle?:ContentBundle;coverage:{expected:number;included:number;missing:string[]}};
const key=(s:{lessonNumber:number;exerciseNumber:string;itemNumber:number})=>`${s.lessonNumber}/${s.exerciseNumber.replace(/[·-]/g,'.')}/${s.itemNumber}`;
export function validateContent(input:unknown):Validation {
 const parsed=bundleSchema.safeParse(input);
 if(!parsed.success)return {ok:false,issues:parsed.error.issues.map(i=>({severity:'error',code:'schema',path:i.path.join('.'),message:i.message})),coverage:{expected:0,included:0,missing:[]}};
 const b=parsed.data,issues:Issue[]=[];
 const add=(code:string,path:string,message:string,severity:'error'|'warning'='error')=>issues.push({code,path,message,severity});
 const tables={sources:b.sources,sourceReferences:b.sourceReferences,courses:b.courses,lessons:b.lessons,microLessons:b.microLessons,activities:b.activities,vocabulary:b.vocabulary,frenchTexts:b.frenchTexts,grammarPoints:b.grammarPoints,exampleSentences:b.exampleSentences,exercises:b.exercises,answerKeys:b.answerKeys,funFacts:b.funFacts,audioAssets:b.audioAssets};
 type Table=keyof typeof tables;
 const indexes=Object.fromEntries(Object.entries(tables).map(([name,rows])=>[name,new Set(rows.map(r=>r.id))])) as Record<Table,Set<string>>;
 const globalIds=new Set<string>();
 for(const [name,rows] of Object.entries(tables))for(const row of rows){if(globalIds.has(row.id))add('duplicate-id',name+'.'+row.id,'IDs must be globally unique.');globalIds.add(row.id)}
 const ref=(table:Table,value:string,path:string)=>{if(!indexes[table].has(value))add('dangling-reference',path,`Unknown ${table} ID: ${value}`)};
 const fieldTables:Record<string,Table>={courseId:'courses',lessonId:'lessons',sourceId:'sources',sourceReferenceId:'sourceReferences',sourceReferenceIds:'sourceReferences',lessonIds:'lessons',microLessonIds:'microLessons',prerequisiteMicroLessonIds:'microLessons',activityIds:'activities',vocabularyId:'vocabulary',vocabularyIds:'vocabulary',relatedVocabularyIds:'vocabulary',frenchTextId:'frenchTexts',frenchTextIds:'frenchTexts',acceptedFrenchTextIds:'frenchTexts',collocationTextIds:'frenchTexts',audioAssetId:'audioAssets',grammarPointId:'grammarPoints',exampleSentenceId:'exampleSentences',exampleSentenceIds:'exampleSentences',exerciseId:'exercises',interactionExerciseId:'exercises',answerKeyId:'answerKeys',funFactId:'funFacts'};
 function walk(value:unknown,path=''){
  if(Array.isArray(value)){value.forEach((v,i)=>walk(v,`${path}.${i}`));return}
  if(!value||typeof value!=='object')return;
  for(const [k,v] of Object.entries(value)){
   const p=path?`${path}.${k}`:k,t=fieldTables[k];
   if(t){if(Array.isArray(v)){if(new Set(v).size!==v.length)add('duplicate-reference',p,'Repeated reference.');v.forEach(x=>ref(t,x,p))}else if(typeof v==='string')ref(t,v,p)}
   if(k==='provenance'||k==='englishProvenance'){
    const x=v as {kind:string;reviewStatus:string};
    if(x.reviewStatus==='needs-review')add('pending-review',p,'Content has not been verified.','warning');
   }
   walk(v,p);
  }
 }
 walk(b);
 for(const s of b.sourceReferences){const doc=b.sources.find(d=>d.id===s.sourceId);if(doc&&s.pdfPage>doc.pageCount)add('source-page',s.id,'Page exceeds source page count.');if(s.bbox&&(s.bbox[2]<=s.bbox[0]||s.bbox[3]<=s.bbox[1]))add('source-bbox',s.id,'Invalid source rectangle.')}
 for(const l of b.lessons){const c=b.courses.find(x=>x.id===l.courseId);if(c&&!c.lessonIds.includes(l.id))add('parent-mismatch',l.id,'Course does not include its lesson.');for(const m of l.microLessonIds){const child=b.microLessons.find(x=>x.id===m);if(child&&child.lessonId!==l.id)add('parent-mismatch',l.id,'Micro lesson belongs to a different lesson.')}if(new Set(l.vocabulary.map(v=>v.vocabularyId)).size!==l.vocabulary.length)add('duplicate-vocabulary',l.id,'One vocabulary ID must have one role per lesson.')}
 for(const c of b.courses)for(const lid of c.lessonIds){const l=b.lessons.find(x=>x.id===lid);if(l&&l.courseId!==c.id)add('parent-mismatch',c.id,'Listed lesson belongs to another course.')}
 const placements=new Map<string,string[]>();
 for(const m of b.microLessons){const l=b.lessons.find(x=>x.id===m.lessonId);if(l&&!l.microLessonIds.includes(m.id))add('unconnected-micro-lesson',m.id,'Micro lesson is not in its lesson sequence.');for(const a of m.activityIds){placements.set(a,[...(placements.get(a)||[]),m.id]);const activity=b.activities.find(x=>x.id===a);if(activity?.kind==='exercise'){const e=b.exercises.find(x=>x.id===activity.exerciseId);if(e&&e.lessonId!==m.lessonId)add('parent-mismatch',a,'Exercise belongs to a different lesson.')}}for(const dep of m.prerequisiteMicroLessonIds){const parent=b.microLessons.find(x=>x.id===dep);if(parent&&l&&parent.lessonId===m.lessonId&&l.microLessonIds.indexOf(dep)>=l.microLessonIds.indexOf(m.id))add('dependency-order',m.id,'A required micro lesson comes after this step or is itself.')}}
 for(const a of b.activities)if((placements.get(a.id)?.length||0)!==1)add('activity-placement',a.id,'Every activity must appear in exactly one micro lesson; alternate views reference it.');
 const visiting=new Set<string>(),done=new Set<string>();
 function visit(mid:string){if(visiting.has(mid)){add('dependency-cycle',mid,'Micro lesson dependency cycle.');return}if(done.has(mid))return;visiting.add(mid);for(const dep of b.microLessons.find(x=>x.id===mid)?.prerequisiteMicroLessonIds||[])visit(dep);visiting.delete(mid);done.add(mid)}
 b.microLessons.forEach(m=>visit(m.id));
 const lex=new Set<string>();for(const v of b.vocabulary){const lexicalKey=v.lexicalKey.normalize('NFC').trim().toLowerCase();if(lex.has(lexicalKey))add('duplicate-lexeme',v.id,'Use one vocabulary ID for this lexical identity across lessons.');lex.add(lexicalKey);if(v.ipa.status==='pending')add('ipa-pending',v.id,'IPA is explicitly unverified.','warning');if(v.partOfSpeech==='noun'&&(v.noun.gender==='unknown'||!v.noun.plural))add('noun-review',v.id,'Noun gender or plural needs review.','warning')}
 for(const f of b.frenchTexts){const audio=b.audioAssets.find(a=>a.id===f.audioAssetId);if(audio&&audio.frenchTextId!==f.id)add('audio-text-mismatch',f.id,'Audio entry targets a different French text.');for(const form of f.forms){if(!f.text.includes(form.surface))add('form-not-in-text',f.id,'Linked form does not occur in this text.');if(form.status==='needs-review')add('form-pending',f.id,'Do not display this mapping as verified.','warning')}}
 for(const audio of b.audioAssets){const f=b.frenchTexts.find(x=>x.id===audio.frenchTextId);if(f&&f.audioAssetId!==audio.id)add('unlinked-audio',audio.id,'Text does not point back to this audio entry.');if(audio.kind==='tts'&&audio.rates.slow>=audio.rates.normal)add('audio-rate',audio.id,'Slow rate must be slower than normal.');if(audio.kind==='local'&&audio.verification==='pending')add('audio-pending',audio.id,'Local audio needs verification.','warning')}
 const originalKeys=new Set<string>();
 for(const e of b.exercises){
  if(!e.prompt.english.trim()&&!e.prompt.frenchTextIds.length)add('empty-prompt',e.id,'Exercise prompt is empty.');
  if(e.provenance.kind==='textbook'&&!e.source)add('missing-original-number',e.id,'Textbook exercise requires original numbering.');
  if(e.provenance.kind!=='textbook'&&e.source)add('invented-original-number',e.id,'Additional exercise must not claim original numbering.');
  if(new Set(e.hints.map(h=>h.level)).size!==e.hints.length)add('duplicate-hint',e.id,'Hint levels must be unique.');
  if(e.source){const k=key(e.source);if(originalKeys.has(k))add('duplicate-original-item',e.id,'Original item appears twice.');originalKeys.add(k);const l=b.lessons.find(x=>x.id===e.lessonId);if(l&&l.originalNumber!==e.source.lessonNumber)add('source-lesson-mismatch',e.id,'Original lesson number differs from its lesson.')}
  const a=b.answerKeys.find(x=>x.id===e.answerKeyId);
  if(a){if(a.exerciseId!==e.id)add('answer-mismatch',e.id,'Answer points to another exercise.');if((a.source?key(a.source):null)!==(e.source?key(e.source):null))add('answer-source-mismatch',e.id,'Original item identity differs between question and answer.');if(!a.answer.english.trim()&&!a.answer.frenchTextIds.length)add('empty-answer',a.id,'Reference answer is empty.');if(e.grading==='exact-set'&&!a.acceptedFrenchTextIds.length)add('grading-empty',e.id,'Exact-set checking requires reviewed accepted forms.');if(e.grading==='choice'&&(!e.options?.length||!a.selectedOptionIds?.length))add('grading-empty',e.id,'Choice grading needs options and correct option IDs.');for(const opt of a.selectedOptionIds||[])if(!e.options?.some(o=>o.id===opt))add('unknown-option',a.id,'Correct option does not exist.');}
  if(e.kind==='translation'&&e.grading!=='self-check')add('translation-grading',e.id,'Open translation must allow self-check in this model.');
  if(!b.activities.some(x=>x.kind==='exercise'&&x.exerciseId===e.id))add('unconnected-exercise',e.id,'Exercise is not accessible from a learning activity.');
 }
 for(const a of b.answerKeys){const e=b.exercises.find(x=>x.id===a.exerciseId);if(e&&e.answerKeyId!==a.id)add('unlinked-answer',a.id,'Exercise does not point back to its answer.');}
 for(const item of b.coverage.expectedTextbookItems){const l=b.lessons.find(x=>x.id===item.lessonId);if(l&&l.originalNumber!==item.source.lessonNumber)add('inventory-lesson-mismatch','coverage','Source inventory lesson identity differs from its lesson.');const e=b.exercises.find(x=>x.source&&key(x.source)===key(item.source));if(e&&e.lessonId!==item.lessonId)add('inventory-lesson-mismatch',e.id,'Exercise and inventory assign different lessons.');}
 const expected=b.coverage.expectedTextbookItems.map(i=>key(i.source));if(new Set(expected).size!==expected.length)add('duplicate-inventory','coverage','Source inventory contains duplicate items.');
 for(const x of originalKeys)if(!expected.includes(x))add('unexpected-original-item','coverage',`Original item absent from source inventory: ${x}`);
 const missing=expected.filter(x=>!originalKeys.has(x));
 for(const x of missing)add('missing-original-item','coverage',`Not yet imported: ${x}`,b.coverage.mode==='complete'?'error':'warning');
 if(b.coverage.mode==='complete'&&expected.length===0)add('empty-inventory','coverage','Complete content requires an independent source inventory.');
 return {ok:!issues.some(x=>x.severity==='error'),issues,bundle:b,coverage:{expected:expected.length,included:originalKeys.size,missing}};
}
