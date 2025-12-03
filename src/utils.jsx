export function createPageUrl(pageName, params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const path = `/${pageName}`;
  return queryParams ? `${path}?${queryParams}` : path;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
