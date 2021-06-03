/**
 * Verify if is a valid CPF document
 *
 * @param cpf The cpf as string or number
 * @return true or false
 */
export function isCpf(cpf: string | number): boolean {
  cpf = cpf.toString()
  cpf = cpf.replace(/[^0-9]/g, '')

  if (cpf === '00000000000') return false

  let soma = 0
  let rest

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  rest = (soma * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(9, 10))) return false

  soma = 0

  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  rest = (soma * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(10, 11))) return false

  return true
}
