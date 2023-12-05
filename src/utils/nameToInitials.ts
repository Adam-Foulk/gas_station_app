export function nameToInitials(name: string) {
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}
