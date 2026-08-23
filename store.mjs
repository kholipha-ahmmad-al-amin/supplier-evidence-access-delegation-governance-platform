import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class AtomicJsonStore {
  constructor(filePath) { this.filePath = filePath; }
  async load() {
    try { const snapshot = JSON.parse(await readFile(this.filePath, 'utf8')); return { cases: Array.isArray(snapshot.cases) ? snapshot.cases : [] }; }
    catch (error) { if (error.code === 'ENOENT') return { cases: [] }; throw error; }
  }
  async save(snapshot) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const temporary = `${this.filePath}.tmp`;
    await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    await rename(temporary, this.filePath);
  }
}
