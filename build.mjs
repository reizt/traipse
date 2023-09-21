import { build } from 'esbuild';
import { resolve } from 'path';
import pkg from './package.json' assert { type: 'json' };

const __dirname = new URL('.', import.meta.url).pathname;

/** @type {import('esbuild').BuildOptions} */
const opts = {
  entryPoints: [resolve(__dirname, './index.ts')],
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  target: 'es2022',
  platform: 'node',
  color: true,
};

const dependencies = Object.keys(pkg.dependencies || {});
const devDependencies = Object.keys(pkg.devDependencies || {});

const mode = process.argv[2];
if (mode === 'development') {
  opts.outfile = resolve(__dirname, './dist/development.js');
  opts.minify = false;
  opts.sourcemap = true;
  opts.bundle = true;
  opts.external = [...dependencies, ...devDependencies];
} else if (mode === 'publish') {
  opts.outfile = resolve(__dirname, './dist/index.js');
  opts.minify = false;
  opts.sourcemap = false;
  opts.bundle = false;
  // opts.external = [...dependencies, ...devDependencies];
} else {
  throw new Error(`Invalid env: ${mode}`);
}

try {
  await build(opts);
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
