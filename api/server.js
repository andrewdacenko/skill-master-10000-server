import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import OpticsAgent from 'optics-agent';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import executableSchema from './schema';

const app = express();

app.use(cors());
app.use(bodyParser.json());

export default ({
                  PORT = 3000,
                  MONGODB_URI = 'mongodb://localhost/skills',
                  OPTICS_API_KEY = 'service:andrewdacenko-skill-master-10000:PUtFjgA5ihOHIx6jgaC7FQ'
                }) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(MONGODB_URI, {
    useMongoClient: true,
  });

  OpticsAgent.configureAgent({apiKey: OPTICS_API_KEY});

  OpticsAgent.instrumentSchema(executableSchema);

  app.use(OpticsAgent.middleware());
  app.use('/graphql', graphqlExpress((req) => ({
    schema: executableSchema,
    context: {
      opticsContext: OpticsAgent.context(req),
    }
  })));

  app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(PORT, () => {
    console.log(`API Server is now running on http://localhost:${PORT}`);
  });
}
