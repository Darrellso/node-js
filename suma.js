import chalk from 'chalk';

export default function suma(a, b) {
  const resultado = a + b;
  console.log(chalk.red(`La suma es: ${resultado}`));
}
