import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateFixtureDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'fixture must contain at least 2 teams' })
  @IsMongoId({
    each: true,
  })
  teams: string[];

  @IsArray()
  @ArrayMinSize(1)
  predictions: string[];

}
