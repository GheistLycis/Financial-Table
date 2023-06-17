import { Request, Response } from "express";
import { GlobalException, isInstanceOfGlobalException } from "src/shared/GlobalException";
import { GlobalResponse } from "src/shared/GlobalResponse";

const warnings = [400, 401, 403, 404, 406]

export function handleResponse(res: Response, { data, message='', status=200 }: GlobalResponse): Response {
  return res.status(status).json({ data, message })
}

export function handleException({ method, originalUrl, body }: Request, res: Response, error: GlobalException | Error): Response {
  const code = isInstanceOfGlobalException(error) ? error.code : 500
  const status = warnings.includes(code) ? 'W' : 'E'
  const time = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit'})

  console.log(`
    (${status}-${code}) 
    ${method} - ${originalUrl}
    ${time}
    BODY: ${JSON.stringify(body)}
    MESSAGE: ${error.message}
  `)
  
  return res.status(code).json({ data: null, message: error.message })
}
