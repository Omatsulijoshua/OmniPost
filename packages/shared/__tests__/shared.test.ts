import { Logger, OmniPostException } from '../src';

describe('Shared Utilities', () => {
  it('should create OmniPostException with status', () => {
    const exc = new OmniPostException('TEST_ERR', 'Something went wrong', 422);
    expect(exc.code).toBe('TEST_ERR');
    expect(exc.status).toBe(422);
  });

  it('should log without error', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    Logger.info('Test log message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
