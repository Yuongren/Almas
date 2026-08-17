import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { audioRoutes } from './routes/audio.js';
const server = Fastify({
    logger: true,
    bodyLimit: 50 * 1024 * 1024,
});
async function start() {
    try {
        await server.register(cors, {
            origin: true,
        });
        await server.register(multipart, {
            limits: {
                fileSize: 50 * 1024 * 1024,
            },
        });
        await server.register(audioRoutes, {
            prefix: '/api',
        });
        const port = Number(process.env.PORT || 4000);
        await server.listen({
            port,
            host: '0.0.0.0',
        });
        console.log(`Backend running on port ${port}`);
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}
start();
