import { start } from "./server/start";

start()
  .then(() => {
    console.log('Connected!');
  }).catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(`Error starting server: ${err.message}`);
    process.exit(-1);
  });