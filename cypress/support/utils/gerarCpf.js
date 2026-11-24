export function gerarCpf() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const digito = (base) => {
    const soma = base.reduce((acc, num, i) => acc + num * (base.length + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  n.push(digito(n));
  n.push(digito(n));
  return n.join('');
}