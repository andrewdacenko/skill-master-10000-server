import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import OpticsAgent from 'optics-agent';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import executableSchema from './schema';

mongoose.Promise = global.Promise;

export default ({
                  PORT = 3000,
                  MONGODB_URI = 'mongodb://localhost/skills',
                  OPTICS_API_KEY
                }) => {
  mongoose.connect(MONGODB_URI, {
    useMongoClient: true,
  });

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  if (OPTICS_API_KEY) {
    OpticsAgent.configureAgent({apiKey: OPTICS_API_KEY});
    OpticsAgent.instrumentSchema(executableSchema);
    app.use(OpticsAgent.middleware());
  }

  app.use('/graphql', graphqlExpress((req) => ({
    schema: executableSchema,
    context: {
      opticsContext: OpticsAgent.context(req),
    }
  })));

  app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(PORT, () => {
    console.log(`API Server is now running on http://localhost:${PORT}`);
  });
}
