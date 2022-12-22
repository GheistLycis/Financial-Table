import { Response } from "express";

const handleResponse = (res: Response, status: number, message: string, data: any) => {
  return res.status(status).json({ data, message })
}

const handleError = (res: Response, error: any) => {
  return res.status(error.type || 500).json({ data: null, message: error.message })
}

export { 
  handleResponse, 
  handleError,
}