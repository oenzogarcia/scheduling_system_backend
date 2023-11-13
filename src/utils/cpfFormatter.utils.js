const cpfFormatter = (cpf) => {
  // Remove caracteres não numéricos
  const cleanedCPF = cpf.replace(/\D/g, '');

  // Adiciona a máscara de CPF
  return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

module.exports = {
    cpfFormatter
};