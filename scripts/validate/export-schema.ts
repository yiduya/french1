import {mkdir,writeFile} from 'node:fs/promises';
import {z} from 'zod';
import {bundleSchema} from '../../src/content/schema';
import {userDataSchema} from '../../src/user-data/schema';
await mkdir('schemas',{recursive:true});
for(const [name,schema] of [['content-v1',bundleSchema],['user-data-v1',userDataSchema]] as const){await writeFile(`schemas/${name}.json`,JSON.stringify(z.toJSONSchema(schema),null,2)+'\n')}
console.log('Exported JSON Schemas. Cross-reference and provenance refinements still require the TypeScript validator.');
