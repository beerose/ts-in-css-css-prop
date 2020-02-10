export const valueToColor = (value: number) => {
  switch (value) {
    case 0:
      return "transparent";
    case 1:
      return "red";
    case 2:
      return "yellow";
    case 3:
      return "orange";
    case 4:
      return "lightgreen";
    default:
      return value > 4 ? "lightgreen" : "inherit";
  }
};

export const passwordStrengthTexts = (value: number) =>
  [
    " ",
    "Weak 😱",
    "Average 😏",
    "Strong 🤗",
    "Very Strong 🤩"
  ][value] || "Amazing 👏";
