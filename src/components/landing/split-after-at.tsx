// Permite cortar el correo después de la @ en pantallas angostas.
export function splitAfterAt(email: string) {
  const at = email.indexOf('@') + 1
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  )
}
