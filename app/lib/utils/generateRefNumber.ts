function generateRefNumber(prefix: string): string {
    const datetime = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);
    return `${prefix}-${datetime}`;
  }
  

export { generateRefNumber };