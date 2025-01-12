import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomColor()
{
    let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    if(randomColor.length != 7){ 
        randomColor = generateRandomColor();
    }
    return randomColor;
    
}
export const getAccessType = (userType: UserType) => {
  switch (userType) {
    case 'creator':
      return ['room:write'];
    case 'editor':
      return ['room:write'];
    case 'viewer':
      return ['room:read', 'room:presence:write'];
    default:
      return ['room:read', 'room:presence:write'];
  }
};