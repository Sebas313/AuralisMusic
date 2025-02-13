
export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar?: string; 
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    
  }
  
  export interface RegisterResponse {
    user: User; 
    token: string; 
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }