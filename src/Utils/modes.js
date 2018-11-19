
export const isNoUIMode = () => {
  let url = new URL(window.location);
  return url.searchParams.get("ui") === 'false' ? true : false;
};