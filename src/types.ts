export interface registerErrorType {
  email?: string;
  name?: string;
  password?: string;
};

export interface LoginPayloadType {
  email: string;
  password: string;
};

export interface LoginErrorType {
  email?: string;
  password?: string;
};

// Auth INput type
export interface AuthInputType {
  label: string;
  type: string;
  name: string;
  errors: registerErrorType;
  callback: (name: string, value: string) => void;
};

//Forgot password payload type
export interface ForgotPasswordPayload {
  email: string;
};

//reset password type
export interface ResetPasswordPayload  {
  email: string;
  signature: string;
  password: string;
  password_confirmation: string;
};

export interface Lead {
  _id:number
  firstName: string;
  lastName: string;
  companyName: string;
  linkedinProfile: string;
  jobTitle: string;
  emailAddress: string;
  phoneNumber: string;
  emailRevealed: boolean;
}

