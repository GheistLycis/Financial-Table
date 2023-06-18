import { Injectable } from '@nestjs/common';



@Injectable()
export class UserService {
  constructor() {}
  
  async get(userName: string): Promise<any> {
    return null
  }
}
