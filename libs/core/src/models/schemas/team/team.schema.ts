import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import * as _ from 'lodash';

export type TeamDocument = Team & Document;

@Schema({
  timestamps: true,
  autoCreate: true,
  toJSON: { virtuals: true },
  toObject: {
    virtuals: true,
  },
})
export class Team {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  publicId: string;

  @Prop({
    type: String,
    lowercase: true,
    required: true,
  })
  name: string;

  @Prop({
    type: Boolean,
    default: false,
    select: false,
  })
  deleted: boolean;
}

const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.statics.searchQuery = (q) => {
  const regex = new RegExp(q);
  const query = [];
  if (_.isNumber(Number(q)) && !_.isNaN(parseInt(q))) {
    query.push({ price: Number(q) });
  }
  return [
    { name: { $regex: regex, $options: 'i' } },
  ];
};

TeamSchema.statics.config = () => {
  return {
    idToken: 'team',
    softDelete: true,
    uniques: ['name'],
    objectIds: [],
    booleanFilters: [],
    arrayFilters: [],
    fillables: ['name'],
    updateFillables: ['name'],
    hiddenFields: ['deleted'],
  };
};

export { TeamSchema };
