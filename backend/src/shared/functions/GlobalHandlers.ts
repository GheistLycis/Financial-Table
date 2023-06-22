import { Request, Response } from "express";
import GlobalException, { isInstanceOfGlobalException } from "../interfaces/GlobalException";
import GlobalResponse from "../interfaces/GlobalResponse";

const warnings = [400, 401, 403, 404, 406]

/**
* Global handler for successful app responses.
* @param response - express Response provided by the request's controller.
* @param payload - payload provided by the controller's service.
* @returns express Response with a default status 200 and a JSON body.
*/
export function handleResponse(res: Response, { data, message='', status=200 }: GlobalResponse): Response {
  return res.status(status).json({ data, message })
}

/**
* Global handler for unsuccessful app responses and errors logging.
* @param request - express Resquest provided by the request's controller, used solely for logging.
* @param response - express Response provided by the request's controller.
* @param error - error thrown by the app, preferably an app GlobalException.
* @returns express Response with a default status 500 and a JSON body containing the error's message.
*/
export function handleException({ method, originalUrl, body }: Request, res: Response, error: GlobalException | Error): Response {
  const code = isInstanceOfGlobalException(error) ? error.code : 500
  const status = warnings.includes(code) ? 'W' : 'E'
  const time = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit'})

  console.log(`
    (${status}-${code}) 
    ${method} - ${originalUrl}
    ${time}
    MESSAGE: ${error.message}
    BODY: ${JSON.stringify(body)}
  `)
  
  return res.status(code).json({ data: null, message: error.message })
}
