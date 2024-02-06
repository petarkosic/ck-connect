import express, { Request, Response, NextFunction } from 'express';
import Consul from 'consul';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
	res.json({
		users: [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		],
	});
});

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
	await deregisterWithConsul('user-service');
	process.exit();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
	console.log(`User service listening at http://localhost:${PORT}`);
	registerWithConsul();
});

async function registerWithConsul() {
	const consul = new Consul({
		promisify: true,
		host: 'ck-consul',
		port: '8500',
	});
	const details = {
		name: 'user-service',
		address: 'ck-user-service',
		port: PORT,
		check: {
			http: 'http://ck-user-service:3000/health',
			interval: '10s',
			timeout: '5s',
		},
	};

	console.log('Registering service with consul', details);
	await consul.agent.service.register(details);
	console.log('Service registered successfully');
}

async function deregisterWithConsul(serviceName: string) {
	const consul = new Consul();
	console.log('Deregistering service with consul', serviceName);
	await consul.agent.service.deregister(serviceName);
	console.log('Service deregistered successfully');
}
