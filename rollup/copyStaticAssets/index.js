import { basename, dirname, extname, relative, resolve } from 'path';
import { copyFile } from 'sander';
import { createFilter } from 'rollup-pluginutils';
import { createHash } from 'crypto';

export default function copyStaticAssets ( options ) {
	const filter = createFilter( options.include, options.exclude );

	let external = Object.create( null );

	return {
		transform ( code, id ) {
			if ( !filter( id ) ) return null;

			const hash = createHash( 'sha1' )
				.update( code )
				.digest( 'hex' )
				.substr( 0, 16 );

			const ext = extname( id );
			const hashed = `${basename( id ).slice( 0, -ext.length )}.${hash}${ext}`;

			const dest = resolve( options.dest, hashed );
			const importPath = relative( dirname( id ), dest );

			return copyFile( id ).to( dest ).then( () => {
				options.oncopy( dest );
				return `import data from '${importPath}'; export default data;`;
			});
		}
	};
}
