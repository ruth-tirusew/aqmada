function getProfitMargin(price: number, cost: number) {
  return ((price - cost) / price) * 100;
}

export { getProfitMargin };