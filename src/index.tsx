export enum MessagesType {
    OPEN_LOGIN = 'open_login',
    LOGIN = 'login',
    LOGOUT = 'logout',
    FETCH = 'fetch',
  }
  
  export interface MessageHandler {
    type: MessagesType;
    callback: (e: any) => void;
  }
  