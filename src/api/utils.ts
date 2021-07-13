export async function apiRequest(
  url: string,
  method = 'GET',
  params: string[] | string = '',
  body: Record<string, any> | string = '',
  json: boolean = true
) {
  // Include auth token if authenticated
  const Authorization = `Bearer ${
    window.localStorage.getItem('token') || 'myVerySecretAdminToken'
  }`;

  // Convert request query if exists
  const queryParams = `?${
    typeof params === 'string' ? params : params.filter((p) => p).join('&')
  }`;

  // Convert request body if exists
  let queryBody = (!['GET', 'DELETE'].includes(method) && body) || null;
  if (queryBody && typeof queryBody !== 'string') {
    queryBody = JSON.stringify(queryBody);
  }

  const headers: any = json ? {
    Authorization,
    'Content-Type': 'application/json',
  } : {
    Authorization
  };

  return fetch(`${process.env.REACT_APP_API_BASE_URL}/${url}${queryParams}`, {
    method,
    headers,
    body: queryBody || null,
  })
    .then((response) => response.json())
    .catch((error) => console.error('api error', error));
}
