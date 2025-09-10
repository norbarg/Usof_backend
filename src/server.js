import app from './app.js';
import { env } from './config/env.js';

const port = env.PORT;
app.listen(port, () => {
    console.log(`UsOf API listening on http://localhost:${port}`);
});
