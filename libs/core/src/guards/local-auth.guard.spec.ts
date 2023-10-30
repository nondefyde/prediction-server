import { LocalAuthGuard } from 'mpr/core';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(() => {
    guard = new LocalAuthGuard();
  });

  describe('LocalAuthGuard', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });
  });
});
