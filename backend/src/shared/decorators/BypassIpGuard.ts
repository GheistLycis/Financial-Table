import { CustomDecorator, SetMetadata } from '@nestjs/common';

export default function BypassIpGuard(): CustomDecorator<string> {
  return SetMetadata('bypassIpGuard', true)
}