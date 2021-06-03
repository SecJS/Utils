export interface ICoordinate {
  latitude: number
  longitude: number
}

export function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function kmRadius(
  centerCord: ICoordinate,
  pointCord: ICoordinate,
): number {
  const radius = 6371

  const { latitude: latitude1, longitude: longitude1 } = centerCord
  const { latitude: latitude2, longitude: longitude2 } = pointCord

  const dLat = deg2rad(latitude2 - latitude1)
  const dLon = deg2rad(longitude2 - longitude1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latitude1)) *
      Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = radius * center

  return distance
}
