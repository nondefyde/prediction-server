import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileType } from 'mpr/core/shared';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true, autoCreate: true })
export class Media {
  @Prop(
    raw({
      url: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        default: 'jpg',
      },
    }),
  )
  file: FileType;

  @Prop({
    type: Boolean,
    default: false,
    select: false,
  })
  deleted: boolean;
}

const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.statics.config = () => {
  return {
    idToken: 'med',
    fillables: [],
    updateFillables: [],
    hiddenFields: ['deleted'],
  };
};

export { MediaSchema };
