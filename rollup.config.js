import svelte from 'rollup-plugin-svelte';
import { spawn } from 'node:child_process';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import livereload from 'livereload';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
  	sourcemap: true,
  	format: 'iife',
  	name: 'app',
  	file: 'public/build/bundle.js'
  },
  plugins: [
  	svelte({
  		// enable run-time checks when not in production
		compilerOptions: {
			dev: !production,
			compatibility: {
				componentApi: 4
			}
		},
  		// we'll extract any component CSS out into
  		// a separate file - better for performance
		emitCss: true
  	}),
	css({ output: 'bundle.css' }),

  	// If you have external dependencies installed from
  	// npm, you'll most likely need these plugins. In
  	// some cases you'll need additional configuration -
  	// consult the documentation for details:
  	// https://github.com/rollup/plugins/tree/master/packages/commonjs
  	resolve({
  		browser: true,
  		dedupe: ['svelte']
  	}),
  	commonjs(),

  	// In dev mode, call `npm run start` once
  	// the bundle has been generated
  	!production && serve(),

  	// Watch the `public` directory and refresh the
  	// browser on changes when not in production
	!production && reload('public'),

  	// If we're building for production (npm run build
  	// instead of npm run dev), minify
  	production && terser()
  ],
  watch: {
  	clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
  	writeBundle() {
  		if (!started) {
  			started = true;

			spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit']
  			});
  		}
  	}
  };
}

function reload(directory) {
	let server;

	return {
		name: 'livereload',
		buildStart() {
			server = livereload.createServer({ host: '0.0.0.0' });
			server.watch(directory);
		},
		banner() {
			return "(function(d){if(d.getElementById('livereloadscript'))return;var s=d.createElement('script');s.async=true;s.src='//'+(self.location.host||'localhost').split(':')[0]+':35729/livereload.js?snipver=1';s.id='livereloadscript';d.head.appendChild(s)})(document);";
		}
	};
}
