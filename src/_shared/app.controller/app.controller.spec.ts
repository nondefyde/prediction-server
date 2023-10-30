import { Test, TestingModule } from '@nestjs/testing';
import { signUpStub } from '../../../test/_lib';
import { requestResponseAndNextFactory } from '..';
import { AppController } from './app.controller';

describe('AppController Unit Tests', () => {
  let appController: AppController;
  const { req, res, next } = requestResponseAndNextFactory(jest);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call the create method', async () => {
      const response = await appController.create(signUpStub, req, res, next);
      expect(response).not.toEqual(null);
    });
  });

  describe('patch', () => {
    it('should call the patch method', async () => {
      const response = await appController.patch(
        '1',
        signUpStub,
        req,
        res,
        next,
      );
      expect(response).not.toEqual(null);
    });
  });

  describe('update', () => {
    it('should call the update method', async () => {
      const response = await appController.update(
        '1',
        signUpStub,
        req,
        res,
        next,
      );

      expect(response).not.toEqual(null);
    });
  });
});
