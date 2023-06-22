import { ValidationError } from "class-validator"
import GlobalException from "../interfaces/GlobalException"

// 400
export function BadRequestException(message): GlobalException {
  return { message, code: 400 }
}

export function UnauthorizedException(message=''): GlobalException {
  return { message, code: 401 }
}

export function ForbiddenException(message=''): GlobalException {
  return { message, code: 403 }
}

export function NotFoundException(message): GlobalException {
  return { message, code: 404 }
}

export function DuplicatedException(message): GlobalException {
  return { message, code: 406 }
}

// 500
export function ServerException(message): GlobalException {
  return { message, code: 500 }
}

// CLASS-VALIDATOR
export function classValidatorError(errors: ValidationError[]): GlobalException {
  const message = errors.map(e => {
    const triggers = []

    for(let trigger in e.constraints) triggers.push(e.constraints[trigger])

    return `PROPRIEDADE: ${e.property} - ${triggers.join('; ')}`
  })

  return BadRequestException(message.join(' / '))
}

