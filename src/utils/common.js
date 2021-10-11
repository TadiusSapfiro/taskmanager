import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInteger(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);
  return array[randomIndex];
};


