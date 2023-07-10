import { ValidationError } from "class-validator"
import GlobalException from "../shared/classes/GlobalException"

// 400
export function BadRequestException(message) {
  return new GlobalException(400, message)
}

export function UnauthorizedException(message='') {
  return new GlobalException(401, message)
}

export function ForbiddenException(message='') {
  return new GlobalException(403, message)
}

export function NotFoundException(message) {
  return new GlobalException(404, message)
}

export function DuplicatedException(message) {
  return new GlobalException(406, message)
}

// 500
export function ServerException(message) {
  return new GlobalException(500, message)
}

// CLASS-VALIDATOR
export function classValidatorError(errors: ValidationError[]) {
  const message = errors.map(e => {
    const triggers = []

    for(let trigger in e.constraints) triggers.push(e.constraints[trigger])

    return `PROPRIEDADE: ${e.property} - ${triggers.join('; ')}`
  })

  return BadRequestException(message.join(' / '))
}

