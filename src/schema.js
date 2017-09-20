import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import models from './models';

const rootSchema = [`
  type Skill {
    id: ID!
    name: String
    count: Int
  }
  
  type Query {
    skills: [Skill]
  }
  
  type Mutation {
    addSkill (name: String!): Skill
    removeSkill (id: ID!): Skill
    trainSkill (id: ID!): Skill
  }
`];

const rootResolvers = {
  Query: {
    skills(root, args, context) {
      return models.Skill.find();
    }
  },
  Mutation: {
    addSkill(root, {name, count = 0}, context) {
      return models.Skill.create({name, count});
    },
    async removeSkill(root, {id}, context) {
      return await models.Skill.findByIdAndRemove(id);
    },
    async trainSkill(root, {id}, context) {
      const skill = await models.Skill.findById(id);
      skill.count++;
      return await skill.save();
    }
  }
};

const schema = [...rootSchema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;
