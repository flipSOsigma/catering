export interface ICustomerDetails {
  unique_id: string
  order_id: string
  customer_name: string
  customer_phone: string
  customer_email: string
}

export interface IEventDetails {
  unique_id: string
  order_id: string
  event_name: string
  event_location: string
  event_date: Date
  event_building: string
  event_category: string
  event_time: string
  
}

export interface ISectionTable {
  unique_id: string
  order_id: string
  section_name: string
  section_note?: string
  section_price: number
  section_portion: number
  section_total_price: number
}

export interface IPortionTable  {
  unique_id: string
  section_id: string
  portion_name: string
  portion_note?: string
  portion_count: number
  portion_price: number
  portion_total_price: number
}

export interface IOrderDetails {
  event_name: string
  created_at: Date
  updated_at: Date
  invitation: number
  visitor: number
  note?: string
  price: number
  portion: number
}

export interface IOrderData {
  data: IOrderDetails
  event: IEventDetails
  customer: ICustomerDetails
  section: ISectionTable[]
  portion: IPortionTable[]
}