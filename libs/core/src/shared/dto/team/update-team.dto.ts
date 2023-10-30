import {
IsString, IsNotEmpty
} from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

}
