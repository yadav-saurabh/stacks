export interface PaymentOptions {
  drivers: {
    stripe: {
      key: string;
    }
  }
}

export interface ChargeOptions {
  currency?: string;
  source?: string;
  description?: string;
  chargeId?: string;
  metadata?: {
    order_id?: string
  }
}
