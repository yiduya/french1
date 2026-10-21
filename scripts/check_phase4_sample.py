"""Independent comparison with the Phase 1 source inventory; requires private inputs."""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parents[1]
b=json.loads((R/'content/private/lesson8-sample.json').read_text())
s=json.loads((R/'artifacts/phase1/lesson8-extraction.json').read_text())
assert b['sources'][0]['sha256']==s['source_sha256']==hashlib.sha256((R/'inputs/pdf/basic-french-premium-third-edition.pdf').read_bytes()).hexdigest()
expected={(q['exercise_id'],q['item_number']) for q in s['exercises']}
assert {(i['source']['exerciseNumber'],i['source']['itemNumber']) for i in b['coverage']['expectedTextbookItems']}==expected
texts={t['id']:t['text'] for t in b['frenchTexts']};answers={a['id']:a for a in b['answerKeys']};refs={r['id']:r for r in b['sourceReferences']}
for e in b['exercises']:
 q=next(q for q in s['exercises'] if q['exercise_id']==e['source']['exerciseNumber'] and q['item_number']==e['source']['itemNumber'])
 assert e['prompt']['english']==q['prompt']
 a=answers[e['answerKeyId']]
 assert texts[a['answer']['frenchTextIds'][0]]==q['textbook_answer']
 assert refs[e['provenance']['sourceReferenceIds'][0]]['pdfPage']==q['prompt_pdf_page']
 assert refs[a['provenance']['sourceReferenceIds'][0]]['pdfPage']==q['answer_pdf_page']
assert len(b['exercises'])==3 and len(expected)==34
assert all(v['ipa']['status']=='pending' and v['ipa']['value'] is None for v in b['vocabulary'])
assert len(b['frenchTexts'])==len(b['audioAssets'])==13
assert 'lessonProgress' not in b and 'reviewHistory' not in b
print('PASS: source SHA, independent 34-item inventory, three exact prompts/answers/source pages, 13 pronunciation mappings, no fabricated IPA or user records')
