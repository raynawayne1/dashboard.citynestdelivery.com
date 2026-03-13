import { Timestamp } from "firebase/firestore"

export type IRegisterUser = {
    username: string,
    email: string,
    fullName: string,
    password: string,
  }

  
 export type ILogin = {
    email: string,
    password: string,
  }

export interface ICreateOrderSchema {
  quantity?: number,
  link?: string,
  username?: string
}


export interface IUsername {
  username: string,
  isTouch: boolean
}

export interface ILink {
  link: string,
  isTouch: boolean,
  isValidUrl: boolean
}
export interface ICommentText {
  commentText: string,
  isTouch: boolean
}


export interface IQuantity {
  error: boolean,
  quantity: number,
  isTouch: boolean,
  message: string
}

export interface ICreateOrder {
  serviceName: string,
  fullName?:string,
  email?:string,
  id:string,
  categoryName: string,
  link: string,
  username: string,
  quantity: number,
  commentText: string,
  amount: number,
  averageTime: string,
  maximum: number,
  minimuim: number,
  description: string,
  status: string,
  charge: number,
  per: number,
  commentLimite?: number,
}


export interface IService {
  id: string;
  averageTime?: string;
  minimuim?: number;
  maximum?: number;
  hideAverageTime?: boolean;
  hideUsername?: boolean;
  hideLink?: boolean;
  description?: string;
  serviceName: string;
  label?: string;
  per?: number;
  amount?: number;
  showDelay?: boolean;
  showExpiry?: boolean;
  showComment?: boolean;
  value?: string;
  commentLimite?: number;
  createdAt?: string;  // Allow FieldValue for writing and Timestamp for reading
  updatedAt?: string;

}



export interface ICategory {
  categoryName: string,
  id?: string,
  services?: IService[],
  createdAt?: string;  // Allow FieldValue for writing and Timestamp for reading
  updatedAt?: string;  // Same here
}



export interface IEditCategory {
  categoryName: string,
  serviceName: string,
}

export interface IOrder {
  minimuim: string;
  description: string;
  maximum: string;
  averageTime: string;
  amount: number;
  categoryName: string;
  quantity: number;
  serviceName: string;
  charge: string;
  status: string;
  per: number;
  link: string;
  createdAt: string; // Using ISO 8601 format for the date string
}

export interface IUser {
  id: string;
  region: string;
  country: string;
  photoURL: string;
  uid: string;
  fullName: string;
  status: string;
  createdAt?: Timestamp;
  org: string;
  query: string;
  emailVerified: boolean;
  countryCode: string;
  providerId: string;
  lat: number;
  updatedAt?: Timestamp;
  zip: string;
  orders: IOrder[]; // Array of orders
  city: string;
  email: string;
  isp: string;
  timezone: string;
  lon: number;
  isAnonymous: boolean;
  regionName: string;
  as: string;
  phoneNumber: string | null; // Can be null if not available
  role: string; // e.g. 'user' or 'admin'
}
export interface IUploadImage {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
}

export interface AddDropLocations {
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
  status: string;
  date: string;
  remarks: string;
}


export interface IShippingPayload {
    senderName: string;
    senderPhone: string;
    senderEmail: string;
    senderAddres: string;
    receiverName: string;
    receiverPhone: string;
    receiverEmail: string;
    receiverAddres: string;
    description: string;
    paymentMode: string;
    shipmentMode: string;
    weight: string;
    carrierReference?: string;
    TrackingId: string;
    destination: string;
    shippingDrops:AddDropLocations[],
    imageParcelImages:IUploadImage[];
    deliveryDate: string;
    pickUpTime: string;
    departureTime: string;
    courierName: string;
    totalFreight: string;
    product: string;
    mode: string;
    origin: string;
    id:string;
    quantity: string;
    created_At:  Date;
    updated_At:Date;
}

