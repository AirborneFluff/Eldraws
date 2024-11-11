export const minValidator = (minValue: number, message: string) => {
  return (_: any, value: any) => {
    if (value && value < minValue) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };
};