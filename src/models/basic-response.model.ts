import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class BasicResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'object',
    default: {},
  })
  data?: object;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<BasicResponse>) {
    super(data);
  }
}

export const apiResponse = (message: string, data?: object) => {
  return new BasicResponse({message, data});
};

export interface BasicResponseRelations {
  // describe navigational properties here
}

export type BasicResponseWithRelations = BasicResponse & BasicResponseRelations;
