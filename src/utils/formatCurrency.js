export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0,00";
  }
  
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
  return formattedValue;
};