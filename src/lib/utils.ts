import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Character } from "../types/Character";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCharacterPrompts = (characters: Character[]) => {
  return characters.map((char) => ({
    role: "system",
    content: `Character: ${char.name} (${char.emoji})
Personality: ${char.personality}
Description: ${char.description}
Please incorporate this character into the story, ensuring their personality and description are reflected in their actions and dialogue.`,
  }));
};
