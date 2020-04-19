export const getRandomNumbers = (lower_bound, upper_bound, amount = 3): Array<number> => {
  const unique_random_numbers = [];

  while (unique_random_numbers.length < amount) {
    const random_number = Math.floor(Math.random() * (upper_bound - lower_bound) + lower_bound);
    if (unique_random_numbers.indexOf(random_number) == -1) {
      unique_random_numbers.push(random_number);
    }
  }
  // console.log(unique_random_numbers.sort());
  return unique_random_numbers.sort((a, b) => a - b);
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};