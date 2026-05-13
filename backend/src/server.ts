import 'dotenv/config';

import { createServer } from 'node:http'

import { createApplication } from './app'
import { initializeSocket } from './common/socket';

async function main() {
    try {
        const server = createServer(createApplication())

        initializeSocket(server);

        const PORT: number = Number(process.env.PORT) || 8000

        server.listen(PORT, () => {
            console.log(`Http server is running on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(`Error starting http server`)
        throw error;
    }
}

main()