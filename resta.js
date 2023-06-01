import chalk from 'chalk';

export default function resta(a, b) {
  const resultado = a - b;
  console.log(chalk.yellow(`La resta es: ${resultado}`));
}
