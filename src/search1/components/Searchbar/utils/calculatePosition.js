// This is important for Downshift, to determine, wich icon was clicked and witch icon should be highlighted

export function calculatePosition(n, hits) {
  var len;

  switch (n) {
  case 1:
    len = 0;
    break;
  case 2:
    len = hits[1].hits.length + 1;
    break;
  case 3:
    len = hits[1].hits.length + hits[2].hits.length + 2;
    break;
  case 4:
    len = hits[1].hits.length + hits[2].hits.length + hits[3].hits.length + 3;
    break;
  case 5:
    len =
        hits[1].hits.length +
        hits[2].hits.length +
        hits[3].hits.length +
        hits[4].hits.length +
        4;
    break;
  default:
    len = null;
    break;
  }

  return len;
}
