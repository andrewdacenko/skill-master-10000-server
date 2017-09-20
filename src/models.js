import mongoose, { Schema } from 'mongoose';

const SkillSchema = new Schema({
  name: {type: String},
  count: {type: Number},
});

const Skill = mongoose.model('Skill', SkillSchema);

export default {
  Skill
}
