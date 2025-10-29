export function weightedPick(list) {
  if (!list || list.length === 0) {
    return null;
  }

  let total = 0;
  for (let i = 0; i < list.length; i ++) {
    total += list[i].weight;
  }

  let rand = Math.random() * total;
  for (let i = 0; i < list.length; i ++) {
    rand -= list[i].weight;
    if (rand < 0) {
      return list[i].value;
    }
  }
  return list[Math.floor(Math.random() * list.length)];
}