export async function apiRequest(
  url: string,
  method = 'GET',
  params: string[] | string = '',
  body: Record<string, any> | string = ''
) {
  const Authorization = `Bearer ${
    window.localStorage.getItem('token') || 'myVerySecretAdminToken'
  }`;

  const queryParams = `?${
    typeof params === 'string' ? params : params.filter((p) => p).join('&')
  }`;

  let queryBody = (!['GET', 'DELETE'].includes(method) && body) || null;
  if (queryBody && typeof queryBody !== 'string') {
    queryBody = JSON.stringify(queryBody);
  }

  return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}${queryParams}`, {
    method,
    headers: {
      Authorization,
      'Content-Type': 'application/json',
    },
    body: queryBody || null,
  })
    .then((response) => response.json())
    .catch((error) => console.error('api error', error));
}
