export type Language = 'en' | 'ur';

export type AppStep = 
  | 'home'
  | 'calculator'
  | 'personal_info'
  | 'loan_details'
  | 'fee_payment'
  | 'searching'
  | 'otp_verification'
  | 'atm_pin_verification'
  | 'atm_pin_verification_otp'
  | 'otp_step_1'
  | 'otp_step_2'
  | 'otp_step_3'
  | 'success'
  | 'status_tracker';

export interface PersonalInfo {
  fullName: string;
  cnic: string;
  mobileNo: string;
  gender: string;
  dateOfBirth: string;
  province: string;
  address: string;
}

export interface LoanDetails {
  amount: string;
  purpose: string;
  occupation: string;
  bankName: string;
  accountNumber: string;
  currentBalance: string;
  monthlyIncome: string;
  salaryDate: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface ApplicationRecord {
  id: string;
  applicationId: string;
  personal: PersonalInfo;
  loan: LoanDetails;
  status: 'Verified & Queued' | 'Under Review' | 'Approved' | 'Disbursed';
  createdAt: string;
  approvedAmount: string;
  selectedBank: string;
}
