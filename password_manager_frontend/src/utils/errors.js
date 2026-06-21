export function getApiError(error) {
  const validation = error.response?.data?.errors;
  if (validation?.length) {
    return validation.map((item) => item.message).join(' ');
  }
  return error.response?.data?.message || 'Something went wrong. Please try again.';
}

