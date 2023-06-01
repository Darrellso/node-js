import chalk from 'chalk';

export default function multiplicacion(a, b) {
  const resultado = a * b;
  console.log(chalk.blue(`La multiplicación es: ${resultado}`));
}
