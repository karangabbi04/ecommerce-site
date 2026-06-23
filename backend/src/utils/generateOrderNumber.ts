export const generateOrderNumber = (
  sequence: number
): string => {

  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const formattedDate =
    `${year}${month}${day}`;

  const paddedSequence =
    sequence
      .toString()
      .padStart(6, "0");

  return `ORD-${formattedDate}-${paddedSequence}`;
};