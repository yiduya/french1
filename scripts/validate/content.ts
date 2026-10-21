import {readFile} from 'node:fs/promises';
import {loadContent} from '../../src/content/load';
const file=process.argv[2];
if(!file){console.error('Usage: npm run content:validate -- <private-bundle.json> [--strict]');process.exit(2)}
try{
 const result=loadContent(await readFile(file,'utf8'));
 console.log(JSON.stringify({ok:result.ok,coverage:result.report.coverage,issues:result.report.issues},null,2));
 process.exitCode=!result.ok||process.argv.includes('--strict')&&result.report.issues.some(x=>x.severity==='warning')?1:0;
}catch(error){console.error(`Cannot read content file: ${error instanceof Error?error.message:'Unknown error'}`);process.exitCode=2}
