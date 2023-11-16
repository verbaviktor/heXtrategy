import * as dotenv from 'dotenv'
dotenv.config();

import app from './server';

app.listen(6969, () => {
    console.log("Server started listening on port 6969");
});