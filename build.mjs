import { build } from 'esbuild';
import { resolve } from 'path';
import pkg from './package.json' assert { type: 'json' };

const __dirname = new URL('.', import.meta.url).pathname;

/** @type {import('esbuild').BuildOptions} */
const opts = {
  entryPoints: [resolve(__dirname, './src/index.ts')],
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  target: 'es2022',
  platform: 'node',
  color: true,
  bundle: true,
};

const mode = process.argv[2];
if (mode === 'development') {
  opts.outfile = resolve(__dirname, './dist/development.js');
  opts.minify = false;
  opts.sourcemap = true;
  opts.external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
} else if (mode === 'production') {
  opts.outfile = resolve(__dirname, './dist/production.js');
  opts.minify = true;
  opts.sourcemap = false;
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
