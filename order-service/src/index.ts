import express, { Request, Response, NextFunction } from 'express';
import Consul from 'consul';

const app = express();
const PORT = 3001;

app.get('/orders', (req, res) => {
	res.json({
		orders: [
			{ id: 101, product: 'Laptop' },
			{ id: 102, product: 'Phone' },
		],
	});
});

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
	await deregisterWithConsul('order-service');
	process.exit();
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
	console.log(`Order service listening at http://localhost:${PORT}`);
	registerWithConsul();
});

async function registerWithConsul() {
	const consul = new Consul({
		promisify: true,
		host: 'ck-consul',
		port: '8500',
	});
	const details = {
		name: 'order-service',
		address: 'ck-order-service',
		port: PORT,
		check: {
			http: 'http://ck-order-service:3001/health',
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
