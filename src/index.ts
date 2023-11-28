import * as dotenv from 'dotenv'
dotenv.config();

import server from './server';

server.listen(6700, () => {
    console.log("Server started listening on port 6700");
});