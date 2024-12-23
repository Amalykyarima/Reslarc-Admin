type Title = 'Mr' | 'Mrs' | 'Miss';

export class Auth {
}

export class Signin {
  email:string = '';
  password: string = '';
}

export class Register {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  otherName: string = '';
  organization: string = '';
  jobTitle: string = '';
  industry: string = '';
  country: string = '';
  password: string = '';
}

export class Request {
  name: string = '';
  description: string = '';
}

export class file {
  file: string = '';
}

export class adminRespond {
  adminNote: string = '';
  files: any;
}
