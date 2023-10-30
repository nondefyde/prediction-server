import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  describe('JwtAuthGuard', () => {
    it('should be defined', () => {
      expect(guard).toBeDefined();
    });
  });
});
