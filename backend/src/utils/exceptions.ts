import { ValidationError } from "class-validator"

// 400
export function BadRequestException(message) {
  return { message, type: 400 }
}

export function ForbiddenException(message) {
  return { message, type: 403 }
}

export function NotFoundException(message) {
  return { message, type: 404 }
}

export function DuplicatedException(message) {
  return { message, type: 406 }
}

// 500
export function ServerException(message) {
  return { message, type: 500 }
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

