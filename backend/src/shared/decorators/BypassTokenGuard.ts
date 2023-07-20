import { CustomDecorator, SetMetadata } from '@nestjs/common';

export default function BypassTokenGuard(): CustomDecorator<string> {
  return SetMetadata('bypassTokenGuard', true)
}