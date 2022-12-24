import { Response } from "express";

export function handleResponse(res: Response, status: number, message: string, data: any) {
  return res.status(status).json({ data, message })
}

export function handleError(res: Response, error: any) {
  return res.status(error.type || 500).json({ data: null, message: error.message })
}
