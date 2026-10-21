/** Storage contracts only. Phase 4 does not persist, migrate or schedule reviews. */
import {z} from 'zod';
import {id} from '../content/schema';
const time=z.iso.datetime();
export const userDataSchema=z.object({
 schemaVersion:z.literal(1),exportedAt:time,
 lessonProgress:z.array(z.object({lessonId:id,lastActivityId:id.nullable(),grammarActivityIds:z.array(id),completedExerciseIds:z.array(id),updatedAt:time}).strict()),
 activityProgress:z.array(z.object({activityId:id,status:z.enum(['visited','completed','skipped']),updatedAt:time}).strict()),
 vocabularyProgress:z.array(z.object({vocabularyId:id,firstLearnedAt:time.nullable(),mastery:z.enum(['new','learning','familiar']),difficult:z.boolean(),nextReviewAt:time.nullable()}).strict()),
 reviewHistory:z.array(z.object({id,vocabularyId:id,reviewedAt:time,rating:z.enum(['again','hard','good','easy'])}).strict()),
 exerciseAttempts:z.array(z.object({id,exerciseId:id,attemptedAt:time,mode:z.enum(['self-check','interactive']),response:z.string(),revealed:z.boolean(),selfAssessment:z.enum(['correct','incorrect']).nullable(),hintLevel:z.number().int().min(0).max(3)}).strict()),
 bookmarks:z.array(z.object({targetId:id,kind:z.enum(['vocabulary','activity']),createdAt:time}).strict()),
 preferences:z.object({locale:z.literal('en'),voiceId:z.string().nullable(),speechRate:z.number().min(.3).max(2),newWordBatch:z.number().int().min(1).max(5),dailyReviewLimit:z.number().int().min(1),exerciseMode:z.enum(['self-check','interactive']),reducedMotion:z.boolean()}).strict(),
}).strict();
export type UserData=z.infer<typeof userDataSchema>;
