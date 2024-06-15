export function clientidValidator(clients_clientcode) {
  const re = /\S+@\S+\.\S+/
  if (!clients_clientcode) return "Client ID can't be empty."
  if (!re.test(clients_clientcode)) return 'Ooops! We need a Client ID.'
  return ''
}
