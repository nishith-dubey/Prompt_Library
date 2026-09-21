import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.NODE_ENV = 'test';
process.env.PROMPT_LIBRARY_DB_FILE = path.join(os.tmpdir(), `prompt-library-vitest-${process.pid}.json`);
process.env.GEMINI_API_KEY = '';

try {
  fs.rmSync(process.env.PROMPT_LIBRARY_DB_FILE, { force: true });
} catch {
  // The test database is disposable; a missing file is already clean.
}