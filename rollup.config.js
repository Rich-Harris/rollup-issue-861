import { relative, resolve } from 'path';
import copyStaticAssets from './rollup/copyStaticAssets/index.js'

let external = Object.create( null );

export default {
	entry: 'src/index.js',
	dest: 'build/index.js',
	format: 'cjs',
	plugins: [
		copyStaticAssets({
			include: 'src/assets/**',
			dest: 'build/assets',
			oncopy: dest => external[ dest ] = true
		})
	],
	external: id => {
		return id in external;
	},
	paths: id => {
		// if this is an external path to an asset, we need to rewrite
		// the URL to be relative to the bundle, *not* the source
		if ( id.startsWith( resolve( 'build/assets' ) ) ) {
			let relativeUrl = relative( resolve( 'build' ), id ).replace( /\\/g, '/' );
			if ( relativeUrl[0] !== '.' ) relativeUrl = `./${relativeUrl}`;
			return relativeUrl;
		}

		return id;
	}
};
