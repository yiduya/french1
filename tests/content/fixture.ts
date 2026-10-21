import type {ContentBundle} from '../../src/content/schema';
/** Synthetic contract fixture; never presented as textbook content. */
export function fixture():ContentBundle{
 const added={kind:'additional-explanation' as const,sourceReferenceIds:[],reviewStatus:'reviewed' as const};
 const textbook={kind:'textbook' as const,sourceReferenceIds:['ref.test'],reviewStatus:'transcription-checked' as const};
 const source={lessonNumber:1,exerciseNumber:'1.1',itemNumber:1};
 return {schemaVersion:1,contentVersion:'test-1',language:'en',targetLanguage:'fr-FR',
 coverage:{mode:'complete',expectedTextbookItems:[{lessonId:'lesson.test',source,sourceReferenceId:'ref.test'}]},
 sources:[{id:'source.test',title:'SYNTHETIC TEST SOURCE — NOT A TEXTBOOK',sha256:'a'.repeat(64),pageCount:1}],
 sourceReferences:[{id:'ref.test',sourceId:'source.test',pdfPage:1,printedPage:null,locator:'Synthetic fixture row'}],
 courses:[{id:'course.test',title:'Synthetic course',lessonIds:['lesson.test'],provenance:added}],
 lessons:[{id:'lesson.test',courseId:'course.test',kind:'lesson',originalNumber:1,title:'Synthetic lesson',microLessonIds:['micro.one','micro.two'],vocabulary:[{vocabularyId:'vocab.test',role:'core'}],provenance:added}],
 microLessons:[{id:'micro.one',lessonId:'lesson.test',title:'First',objective:'Test references.',activityIds:['activity.word','activity.grammar'],prerequisiteMicroLessonIds:[],provenance:added},{id:'micro.two',lessonId:'lesson.test',title:'Second',objective:'Test links.',activityIds:['activity.exercise','activity.fact'],prerequisiteMicroLessonIds:['micro.one'],provenance:added}],
 activities:[{id:'activity.word',title:'Word',kind:'vocabulary',vocabularyIds:['vocab.test'],provenance:added},{id:'activity.grammar',title:'Grammar',kind:'grammar',grammarPointId:'grammar.test',provenance:added},{id:'activity.exercise',title:'Exercise',kind:'exercise',exerciseId:'exercise.test',provenance:added},{id:'activity.fact',title:'Fact',kind:'fun-fact',funFactId:'fact.test',provenance:added}],
 vocabulary:[{id:'vocab.test',lexicalKey:'tester|verb|test',lemma:{frenchTextId:'fr.test'},meaning:'to test',partOfSpeech:'verb',ipa:{status:'pending',value:null,reason:'Synthetic fixture has no IPA.'},verb:{group:'regular-er',conjugations:[],collocationTextIds:[]},exampleSentenceIds:['example.test'],relatedVocabularyIds:[],memoryTips:[],provenance:added}],
 frenchTexts:[{id:'fr.test',text:'tester',audioAssetId:'audio.test',forms:[],provenance:added}],
 grammarPoints:[{id:'grammar.test',title:'Synthetic grammar',essential:{english:'Test-only explanation.',frenchTextIds:['fr.test'],provenance:added},exampleSentenceIds:['example.test'],provenance:added}],
 exampleSentences:[{id:'example.test',french:{frenchTextId:'fr.test'},translation:{english:'to test',provenance:added},provenance:added}],
 exercises:[{id:'exercise.test',lessonId:'lesson.test',source,kind:'translation',instruction:{english:'Synthetic test instruction.',frenchTextIds:[],provenance:added},prompt:{english:'Synthetic prompt.',frenchTextIds:[]},answerKeyId:'answer.test',grading:'self-check',hints:[],provenance:textbook}],
 answerKeys:[{id:'answer.test',exerciseId:'exercise.test',source,answer:{english:'',frenchTextIds:['fr.test']},acceptedFrenchTextIds:[],provenance:textbook}],
 funFacts:[{id:'fact.test',category:'language',title:'Synthetic fact',frenchTextIds:['fr.test'],english:'Not real teaching content.',englishProvenance:added,relatedVocabularyIds:['vocab.test'],provenance:{...added,kind:'additional-fun-fact'}}],
 audioAssets:[{id:'audio.test',kind:'tts',frenchTextId:'fr.test',locale:'fr-FR',rates:{normal:1,slow:.7}}]};
}
