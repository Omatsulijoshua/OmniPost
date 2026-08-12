import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
  });

  it('should encrypt and decrypt string using AES-256-GCM authenticated cipher', () => {
    const secret = 'my_super_secret_oauth_token_12345';
    const encrypted = service.encryptSecret(secret);

    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();

    const decrypted = service.decryptSecret(
      encrypted.ciphertext,
      encrypted.iv,
      encrypted.tag,
    );

    expect(decrypted).toBe(secret);
  });

  it('should redact sensitive password and token fields in log payload', () => {
    const rawPayload = {
      email: 'user@example.com',
      password: 'SuperPassword123!',
      nested: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        publicField: 'visible_data',
      },
    };

    const sanitized = service.sanitizeLogPayload(rawPayload);

    expect(sanitized.email).toBe('user@example.com');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.nested.accessToken).toBe('[REDACTED]');
    expect(sanitized.nested.publicField).toBe('visible_data');
  });
});
