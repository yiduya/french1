"""Create a small private content bundle from previously checked Phase 1 artifacts.
Not a full-book converter; no generated IPA or invented textbook answers.
"""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[2];A=R/'artifacts/phase1'
source=json.loads((A/'lesson8-extraction.json').read_text())
tables=json.loads((A/'lesson8-image-tables.json').read_text())
output=R/'content/private/lesson8-sample.json';output.parent.mkdir(parents=True,exist_ok=True)
def provenance(kind='textbook',refs=None):return {'kind':kind,'sourceReferenceIds':refs or (['ref.p46'] if kind=='textbook' else []),'reviewStatus':'transcription-checked' if kind=='textbook' else 'needs-review'}
def prose(english,fr=None):return {'english':english,'frenchTextIds':fr or [],'provenance':provenance('additional-explanation')}
b={'schemaVersion':1,'contentVersion':'0.4.0-sample','language':'en','targetLanguage':'fr-FR',
 'coverage':{'mode':'sample','expectedTextbookItems':[]},'sources':[{'id':'source.basic-french','title':'Practice Makes Perfect: Basic French, Premium Third Edition','sha256':source['source_sha256'],'pageCount':334}],
 'sourceReferences':[{'id':f'ref.p{n}','sourceId':'source.basic-french','pdfPage':n,'printedPage':None,'locator':loc} for n,loc in [(46,'Lesson 8; endings and vocabulary tables; Exercise 8.1'),(47,'Exercise 8.1 continuation and 8.2/8.3'),(48,'Exercises 8.3/8.4'),(49,'Flowers and colors Fun Fact'),(274,'Answer key 8.1 items 1–4'),(275,'Answer key 8.1 continuation and 8.2–8.4'),(328,'Part II - L8 Fun Fact translation')]],
 'courses':[],'lessons':[],'microLessons':[],'activities':[],'vocabulary':[],'frenchTexts':[],'grammarPoints':[],'exampleSentences':[],'exercises':[],'answerKeys':[],'funFacts':[],'audioAssets':[]}
def french(fid,text,prov):
 aid='audio.'+fid
 b['frenchTexts'].append({'id':fid,'text':text,'audioAssetId':aid,'forms':[],'provenance':prov})
 b['audioAssets'].append({'id':aid,'kind':'tts','frenchTextId':fid,'locale':'fr-FR','rates':{'normal':1,'slow':0.7}})
 return fid
def identity(q):return {'lessonNumber':8,'exerciseNumber':q['exercise_id'],'itemNumber':q['item_number']}
for q in source['exercises']:b['coverage']['expectedTextbookItems'].append({'lessonId':'lesson.08','source':identity(q),'sourceReferenceId':f"ref.p{q['prompt_pdf_page']}"})
verbs=['finir','choisir','réussir'];slugs=['finir','choisir','reussir'];examples=['Je finis.','Tu choisis.','Il réussit.'];translations=['I finish.','You choose.','He succeeds.']
meanings=dict(tables['tables'][1]['rows'])
for word,slug,example,translation in zip(verbs,slugs,examples,translations):
 fid=french('fr.lemma.'+slug,word,provenance())
 eid='example.'+slug
 efid=french('fr.example.'+slug,example,provenance('additional-explanation'))
 b['exampleSentences'].append({'id':eid,'french':{'frenchTextId':efid},'translation':{'english':translation,'provenance':provenance('additional-explanation')},'provenance':provenance('additional-explanation')})
 b['vocabulary'].append({'id':'vocab.'+slug,'lexicalKey':word+'|verb|general','lemma':{'frenchTextId':fid},'meaning':meanings[word],'partOfSpeech':'verb','ipa':{'status':'pending','value':None,'reason':'No independently verified IPA source has been recorded.'},'verb':{'group':'regular-ir-finir','conjugations':[],'collocationTextIds':[]},'exampleSentenceIds':[eid],'relatedVocabularyIds':[],'memoryTips':[],'provenance':provenance()})
# Real original items whose vocabulary is represented in this small sample.
for q in source['exercises']:
 if q['exercise_id']!='8.1' or q['item_number'] not in [1,7,9]:continue
 suffix=f"8.1.{q['item_number']}";exid='exercise.'+suffix;answerid='answer.'+suffix
 afid=french('fr.answer.'+suffix,q['textbook_answer'],provenance(refs=[f"ref.p{q['answer_pdf_page']}"]))
 b['exercises'].append({'id':exid,'lessonId':'lesson.08','source':identity(q),'kind':'translation','instruction':prose('Translate into French.'),'prompt':{'english':q['prompt'],'frenchTextIds':[]},'answerKeyId':answerid,'grading':'self-check','hints':[],'provenance':provenance(refs=[f"ref.p{q['prompt_pdf_page']}"])})
 b['answerKeys'].append({'id':answerid,'exerciseId':exid,'source':identity(q),'answer':{'english':'','frenchTextIds':[afid]},'acceptedFrenchTextIds':[],'provenance':provenance(refs=[f"ref.p{q['answer_pdf_page']}"])})
 b['activities'].append({'id':'activity.'+exid,'kind':'exercise','title':f"Exercise 8.1 — Item {q['item_number']}",'exerciseId':exid,'provenance':provenance(refs=[f"ref.p{q['prompt_pdf_page']}"])})
for word,slug,item,subject in [('finir','finir',1,'vous'),('choisir','choisir',9,'tu'),('réussir','reussir',7,'il')]:
 v=next(v for v in b['vocabulary'] if v['id']=='vocab.'+slug)
 # Source answers contain these forms; keep a separate form text for precise pronunciation.
 q=next(q for q in source['exercises'] if q['exercise_id']=='8.1' and q['item_number']==item)
 form=q['textbook_answer'].split(' ',1)[1].rstrip('.')
 fid=french('fr.form.'+slug,form,provenance(refs=[f"ref.p{q['answer_pdf_page']}"]))
 v['verb']['conjugations']=[{'subject':subject,'tense':'present','form':{'frenchTextId':fid},'provenance':provenance(refs=[f"ref.p{q['answer_pdf_page']}"])}]
 answertext=next(t for t in b['frenchTexts'] if t['id']==f"fr.answer.8.1.{item}")
 answertext['forms']=[{'surface':form,'vocabularyId':v['id'],'grammarLabel':subject+' present','status':'verified'}]
b['grammarPoints'].append({'id':'grammar.ir-present','title':'Regular -ir present endings','essential':prose('For this group, remove -ir and add the subject ending. Je and tu take -is; il, elle and on take -it.',['fr.example.finir','fr.example.choisir','fr.example.reussir']),'explanation':prose('Nous takes -issons, vous takes -issez, and ils/elles take -issent. These forms belong to the regular finir group.'),'deepDive':prose('An infinitive ending in -ir alone does not identify this pattern.'),'exampleSentenceIds':['example.'+x for x in slugs],'provenance':provenance('additional-explanation')})
ffid=french('fr.fact.lilies','Les lys blanchissent.',{**provenance(refs=['ref.p49']),'note':'French clause transcribed without the inline English gloss.'})
b['funFacts'].append({'id':'fact.flowers-excerpt','category':'language','title':'Flowers and colors — excerpt','frenchTextIds':[ffid],'english':'Lilies turn white.','englishProvenance':provenance(refs=['ref.p328']),'relatedVocabularyIds':[],'provenance':provenance(refs=['ref.p49'])})
b['activities'][:0]=[{'id':'activity.vocabulary','kind':'vocabulary','title':'Three useful verbs','vocabularyIds':['vocab.'+x for x in slugs],'provenance':provenance('additional-explanation')},{'id':'activity.grammar','kind':'grammar','title':'Recognize the present endings','grammarPointId':'grammar.ir-present','provenance':provenance('additional-explanation')}]
b['activities'].append({'id':'activity.fact','kind':'fun-fact','title':'A color-change example','funFactId':'fact.flowers-excerpt','provenance':provenance(refs=['ref.p49'])})
for mid,title,acts,deps in [('sample.words','Three useful verbs',['activity.vocabulary'],[]),('sample.pattern','The regular pattern',['activity.grammar'],['sample.words']),('sample.practice','Original exercise samples',['activity.exercise.8.1.9','activity.exercise.8.1.7','activity.exercise.8.1.1'],['sample.pattern']),('sample.connection','A source excerpt',['activity.fact'],[])]:
 b['microLessons'].append({'id':mid,'lessonId':'lesson.08','title':title,'objective':'Validate content references using a limited source sample.','activityIds':acts,'prerequisiteMicroLessonIds':deps,'provenance':provenance('additional-explanation')})
b['lessons']=[{'id':'lesson.08','courseId':'course.basic-french','kind':'lesson','originalNumber':8,'title':'-Ir verb endings · Common -ir verbs','microLessonIds':[m['id'] for m in b['microLessons']],'vocabulary':[{'vocabularyId':'vocab.'+x,'role':'core'} for x in slugs],'provenance':provenance()}]
b['courses']=[{'id':'course.basic-french','title':'Practice Makes Perfect: Basic French — private sample','lessonIds':['lesson.08'],'provenance':provenance('additional-explanation')}]
output.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n');print(output)
