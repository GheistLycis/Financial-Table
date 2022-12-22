
const NotFoundException = message => {
  return { message, type: 404 }
}

const DuplicatedException = message => {
  return { message, type: 406 }
}

const ServerException = message => {
  return { message, type: 500 }
}

export { 
  NotFoundException, 
  DuplicatedException,
  ServerException
}
