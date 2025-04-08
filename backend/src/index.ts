import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/inversify.config.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
});

const app = server.build();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app }; 