# Vite Bonjour Advertise

This package is a vite plugin to advertise any hosted vite bundle over Bonjour

## Installation

```
npm install @eventengineering/vite-bonjour-advertise
```

## Usage

```js
import ViteBonjourAdvertise from '@eventengineering/vite-bonjour-advertise';

export default defineConfig(() => ({
	...
	plugins: [
		...
		ViteBonjourAdvertise(),
	],
});
```

## Settings

A settings object can be passed into the function. This can contain:

 - `name` (string - defaults to the OS hostname)
 - `types` (Array of string - defaults to "http" and "vite")
