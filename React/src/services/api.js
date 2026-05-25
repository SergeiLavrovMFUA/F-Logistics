export async function getCharacters() {
  const response = await fetch('http://localhost:5000/characters')

  if (!response.ok) {
    throw new Error('Failed to load characters')
  }

  return response.json()
}
