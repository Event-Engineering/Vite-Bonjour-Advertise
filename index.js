import Bonjour from '@eventengineering/bonjour';
import os from 'os';

class AdvertiseServer {
	name = 'advertise-server';
	#server;
	#addressSets = [];
	#bonjour;
	#settings;

	get bonjourName() {
		return this.#settings.name.replace(/[^a-z0-9]/gi, '').substring(0, 15) || (os.hostname().replace(/[^a-z0-9]/gi, '').substring(0, 10) + Math.floor(Math.random() * 100000));
	}

	get types() {
		return this.#settings.types || ['http', 'vite'];
	}

	constructor(settings) {
		this.#settings = settings || {};
		this.#bonjour = new Bonjour(this.#settings.bonjour);
	}

	configureServer(server, ...args) {
		this.#server = server;

		this.#advertise(this.#server.httpServer.address());

		this.#server.httpServer.on('listening', () => {
			this.#advertise(this.#server.httpServer.address());
		});
	}

	#advertise(addressSet) {
		if ( ! addressSet) {
			return;
		}

		let {address, port, family} = addressSet;

		if (
			! (family === 'IPv4' && address.startsWith('127.'))
			&& ! (family === 'IPv6' && address === '::1')
			&& ! this.#addressSets.some((a) => a.family === family && a.address === address && a.port === port)
		) {
			this.#addressSets.push(addressSet);

			this.types.forEach((type) => {
				setTimeout(() => {
					this.#server.config.logger.info('Advertising', {name: this.bonjourName, type, port});
				});
				this.#bonjour.publish({name: this.bonjourName, type, port});
			});
		} else {
			setTimeout(() => {
				this.#server.config.logger.warn('Ignoring', {family, address, port});
			});
		}
	}
}

export default (...args) => {
	let obj = new AdvertiseServer(...args);

	return Object.fromEntries(
		Object.getOwnPropertyNames(AdvertiseServer.prototype)
		.filter((key) => {
			return key !== 'constructor' && obj[key] instanceof Function;
		})
		.map((key) => {
			return [key, obj[key].bind(obj)];
		})
	);
};
