import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as _ from 'lodash';

export type FixtureDocument = Fixture & Document;

@Schema({
  timestamps: true,
  autoCreate: true,
  toJSON: { virtuals: true },
  toObject: {
    virtuals: true,
  },
})
export class Fixture {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  publicId: string;

  @Prop({
    type: [String],
    required: true,
    lowercase:true
  })
  teams: string[];

  @Prop({
    type: [String],
    required: true,
    lowercase:true
  })
  predictions: string[];

  @Prop({
    type: Boolean,
    default: false,
    select: false,
  })
  deleted: boolean;
}

const FixtureSchema = SchemaFactory.createForClass(Fixture);

FixtureSchema.statics.searchQuery = (q) => {
  const regex = new RegExp(q);
  const query = [];
  if (_.isNumber(Number(q)) && !_.isNaN(parseInt(q))) {
    query.push({ price: Number(q) });
  }
  return [
    { title: { $regex: regex, $options: 'i' } },
    { description: { $regex: regex, $options: 'i' } },
  ];
};

FixtureSchema.statics.config = () => {
  return {
    idToken: 'fixture',
    softDelete: true,
    uniques: [],
    objectIds: [],
    booleanFilters: [],
    arrayFilters: ['teams', 'predictions'],
    fillables: [
      'teams',
      'predictions',
    ],
    updateFillables: [],
    hiddenFields: ['deleted'],
  };
};

export { FixtureSchema };
