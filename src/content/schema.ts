import { z } from 'zod';

export const id = z.string().regex(/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/);
const nonempty = z.string().trim().min(1);
const ids = z.array(id);
const provenance = z.object({
  kind: z.enum(['textbook','additional-explanation','extra-practice','additional-fun-fact']),
  sourceReferenceIds: ids,
  reviewStatus: z.enum(['needs-review','transcription-checked','reviewed']),
  note: nonempty.optional(),
}).strict().superRefine((p,ctx)=>{
  if(p.kind==='textbook'&&!p.sourceReferenceIds.length)ctx.addIssue({code:'custom',message:'Textbook content needs a source reference.'});
});
const record = {id,provenance};
const textRef = z.object({frenchTextId:id}).strict();
const prose = z.object({english:nonempty,frenchTextIds:ids,provenance}).strict();
const pos = z.enum(['noun','verb','adjective','adverb','pronoun','preposition','conjunction','expression','other']);
const ipa = z.discriminatedUnion('status',[
  z.object({status:z.literal('pending'),value:z.null(),reason:nonempty}).strict(),
  z.object({status:z.literal('verified'),value:nonempty,reference:nonempty,verifiedBy:nonempty,verifiedAt:z.iso.date(),locale:z.literal('fr-FR')}).strict(),
]);
const vocabularyBase = {...record,lexicalKey:nonempty,lemma:textRef,meaning:nonempty,ipa,exampleSentenceIds:ids,relatedVocabularyIds:ids,memoryTips:z.array(z.object({kind:z.enum(['meaning','grammar']),explanation:prose}).strict())};
export const vocabularySchema = z.discriminatedUnion('partOfSpeech',[
  z.object({...vocabularyBase,partOfSpeech:z.literal('verb'),verb:z.object({group:z.enum(['regular-er','regular-ir-finir','regular-re','irregular','unclassified']),conjugations:z.array(z.object({subject:nonempty,tense:z.literal('present'),form:textRef,provenance}).strict()),collocationTextIds:ids}).strict()}).strict(),
  z.object({...vocabularyBase,partOfSpeech:z.literal('noun'),noun:z.object({articleForm:textRef,gender:z.enum(['masculine','feminine','common','unknown']),plural:z.union([textRef,z.null()]),reviewNote:nonempty.optional()}).strict()}).strict(),
  z.object({...vocabularyBase,partOfSpeech:pos.exclude(['verb','noun'])}).strict(),
]);
const activityBase={...record,title:nonempty};
export const activitySchema=z.discriminatedUnion('kind',[
 z.object({...activityBase,kind:z.literal('vocabulary'),vocabularyIds:ids.min(1).max(5)}).strict(),
 z.object({...activityBase,kind:z.literal('grammar'),grammarPointId:id}).strict(),
 z.object({...activityBase,kind:z.literal('example'),exampleSentenceId:id}).strict(),
 z.object({...activityBase,kind:z.literal('exercise'),exerciseId:id}).strict(),
 z.object({...activityBase,kind:z.literal('fun-fact'),funFactId:id}).strict(),
 z.object({...activityBase,kind:z.literal('review'),vocabularyIds:ids.min(1)}).strict(),
 z.object({...activityBase,kind:z.literal('discovery'),body:prose}).strict(),
]);
const sourceIdentity=z.object({lessonNumber:z.number().int().positive(),exerciseNumber:nonempty,itemNumber:z.number().int().positive()}).strict();
export const bundleSchema=z.object({
 schemaVersion:z.literal(1),contentVersion:nonempty,language:z.literal('en'),targetLanguage:z.literal('fr-FR'),
 coverage:z.object({mode:z.enum(['sample','complete']),expectedTextbookItems:z.array(z.object({lessonId:id,source:sourceIdentity,sourceReferenceId:id}).strict())}).strict(),
 sources:z.array(z.object({id,title:nonempty,sha256:z.string().regex(/^[a-f0-9]{64}$/),pageCount:z.number().int().positive()}).strict()),
 sourceReferences:z.array(z.object({id,sourceId:id,pdfPage:z.number().int().positive(),printedPage:z.string().nullable(),bbox:z.tuple([z.number().nonnegative(),z.number().nonnegative(),z.number().nonnegative(),z.number().nonnegative()]).optional(),locator:nonempty}).strict()),
 courses:z.array(z.object({...record,title:nonempty,lessonIds:ids.min(1)}).strict()).min(1),
 lessons:z.array(z.object({...record,courseId:id,kind:z.enum(['lesson','revision']),originalNumber:z.number().int().positive(),title:nonempty,microLessonIds:ids.min(1),vocabulary:z.array(z.object({vocabularyId:id,role:z.enum(['core','supporting','optional'])}).strict())}).strict()).min(1),
 microLessons:z.array(z.object({...record,lessonId:id,title:nonempty,objective:nonempty,activityIds:ids.min(1),prerequisiteMicroLessonIds:ids}).strict()),
 activities:z.array(activitySchema),
 vocabulary:z.array(vocabularySchema),
 frenchTexts:z.array(z.object({...record,text:nonempty,audioAssetId:id,forms:z.array(z.object({surface:nonempty,vocabularyId:id,grammarLabel:nonempty,status:z.enum(['verified','needs-review'])}).strict())}).strict()),
 grammarPoints:z.array(z.object({...record,title:nonempty,essential:prose,explanation:prose.optional(),deepDive:prose.optional(),exampleSentenceIds:ids}).strict()),
 exampleSentences:z.array(z.object({...record,french:textRef,translation:z.object({english:nonempty,provenance}).strict()}).strict()),
 exercises:z.array(z.object({...record,lessonId:id,source:sourceIdentity.nullable(),kind:z.enum(['translation','true-false','fill-blank','multiple-choice','matching','conjugation','sentence-completion','listening','open-response']),instruction:prose,prompt:z.object({english:z.string(),frenchTextIds:ids}).strict(),answerKeyId:id,grading:z.enum(['self-check','exact-set','choice']),options:z.array(z.object({id,english:nonempty,frenchTextIds:ids}).strict()).optional(),hints:z.array(z.object({level:z.number().int().min(1).max(3),body:prose}).strict()).max(3)}).strict()),
 answerKeys:z.array(z.object({...record,exerciseId:id,source:sourceIdentity.nullable(),answer:z.object({english:z.string(),frenchTextIds:ids}).strict(),acceptedFrenchTextIds:ids,explanation:prose.optional(),selectedOptionIds:ids.optional()}).strict()),
 funFacts:z.array(z.object({...record,category:z.enum(['language','culture','memory']),title:nonempty,frenchTextIds:ids,english:nonempty,englishProvenance:provenance,relatedVocabularyIds:ids,interactionExerciseId:id.optional()}).strict()),
 audioAssets:z.array(z.discriminatedUnion('kind',[
  z.object({id,kind:z.literal('tts'),frenchTextId:id,locale:z.literal('fr-FR'),rates:z.object({normal:z.number().min(.5).max(2),slow:z.number().min(.3).max(1)}).strict()}).strict(),
  z.object({id,kind:z.literal('local'),frenchTextId:id,locale:z.literal('fr-FR'),path:z.string().regex(/^audio\/[a-zA-Z0-9_./-]+$/).refine(s=>!s.includes('..')),verification:z.enum(['pending','verified'])}).strict(),
 ])),
}).strict();
export type ContentBundle=z.infer<typeof bundleSchema>;
export type Vocabulary=z.infer<typeof vocabularySchema>;
