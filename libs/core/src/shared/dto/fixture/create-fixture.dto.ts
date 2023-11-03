import {
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class CreateFixtureDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'fixture must contain at least 2 teams' })
  teams: string[];

  @IsArray()
  @ArrayMinSize(1)
  predictions: string[];

}
