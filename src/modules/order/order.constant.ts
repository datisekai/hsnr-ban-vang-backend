export enum OrderType {
  SellGold = 'sell_gold',
}

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Canceled = 'canceled',
  Wrong = 'wrong',
  Sending = 'sending',
  ErrorSendGold = 'error_send_gold',
}

export enum TransferType {
  MBBANK = 'mbbank',
}

export enum TransferStatus {
  NotTransaction = 'not_transaction',
  Success = 'success',
  SendGoldFail = 'send_gold_fail',
  LoginFail = 'login_fail',
  NotFoundOrder = 'not_found_order',
  OutOfDate = 'out_of_date',
  WrongAmount = 'wrong_amount',
}
