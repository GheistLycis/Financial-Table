import { SetMetadata } from '@nestjs/common';

export const BypassTokenGuard = () => SetMetadata('bypassTokenGuard', true)