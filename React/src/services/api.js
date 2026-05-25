export async function getLogistics() {
  const response = await fetch('http://localhost:5000/F-Logistics')
  
  if (!response.ok) {
    throw new Error('Failed to load F-Logistics')
  }
  
  return response.json()
}