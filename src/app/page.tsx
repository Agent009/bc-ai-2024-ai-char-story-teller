"use client";
import React from "react";
import { useState } from "react";
import { useChat } from "ai/react";
import { TextField } from "@mui/material";
import { getApiUrl } from "@lib/api.ts";
import { constants } from "@lib/constants.ts";
import { characters as defaultCharacters, genres, tones } from "@lib/storyTeller"; // Add this import
import { Character } from "types/Character";

// Add this type definition at the top of the file, outside the component
type ChatBody = {
  temperature: number;
  characters: Character[];
  genre: string;
  tone: string;
  evaluation?: string | undefined;
  isEvaluated: boolean; // Add isEvaluated state
};

export default function Chat() {
  const [characters, setCharacters] = useState(defaultCharacters);
  const [newCharacter, setNewCharacter] = useState({ name: "", description: "", personality: "" });
  const [state, setState] = useState({
    genre: "",
    tone: "",
    temperature: "" + constants.openAI.temperature,
    evaluation: "",
    isEvaluated: false,
  });
  const { messages, append, isLoading } = useChat({
    api: getApiUrl(constants.routes.api.chat),
    keepLastMessageOnError: true,
    onError(error) {
      console.log("error", error);
    },
    body: {
      temperature: parseFloat(state.temperature),
      characters: characters,
      genre: state.genre,
      tone: state.tone,
    } as ChatBody,
  });
  // console.log("page -> input", input, "messages", messages);

  const addCharacter = () => {
    if (newCharacter.name && newCharacter.description && newCharacter.personality) {
      setCharacters([...characters, { ...newCharacter, emoji: "👤" }]);
      setNewCharacter({ name: "", description: "", personality: "" });
    }
  };

  const editCharacter = (index: number, field: string, value: string) => {
    const updatedCharacters = [...characters];
    updatedCharacters[index] = { ...updatedCharacters[index], [field]: value };
    setCharacters(updatedCharacters);
  };

  const deleteCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  // Function to evaluate the joke
  const evaluateContent = async (content: string) => {
    // Replace with your evaluation logic or API call
    const evaluation = await fetch(getApiUrl(constants.routes.api.evaluate), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }).then((res) => res.json());
    console.log("page -> evaluateContent -> evaluation", evaluation.text);
    setState((prevState) => ({
      ...prevState,
      evaluation: evaluation.text, // Assuming the API returns { result: "funny" | "appropriate" | "offensive" }
      isEvaluated: true, // Set isEvaluated to true after evaluation
    }));
  };

  const handleEvaluateClick = () => {
    if (messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate")) {
      evaluateContent(messages[messages.length - 1]?.content);
    }
  };

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
      isEvaluated: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 max-w-3xl mx-auto">
        <div className="mx-auto space-y-2">
          <h2 className="text-3xl font-bold">Multi-Character Story Telling App</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Customize the story by adding characters, selecting the genre and setting the tone.
          </p>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold">Characters</h3>

          <div className="space-y-4">
            {characters.map((character, index) => (
              <div key={index} className="rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex-grow flex space-x-2">
                    <TextField
                      label="Name"
                      variant="standard"
                      value={character.name}
                      onChange={(e) => editCharacter(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <TextField
                      label="Personality"
                      variant="standard"
                      value={character.personality || ""}
                      onChange={(e) => editCharacter(index, "personality", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <button
                    onClick={() => deleteCharacter(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <TextField
                  label="Description"
                  variant="standard"
                  value={character.description}
                  onChange={(e) => editCharacter(index, "description", e.target.value)}
                  className="w-full"
                  multiline
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex-grow flex space-x-2">
                  <TextField
                    label="Name"
                    variant="standard"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                    className="flex-1"
                  />
                  <TextField
                    label="Personality"
                    variant="standard"
                    value={newCharacter.personality}
                    onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <button
                  onClick={addCharacter}
                  className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                  tabIndex={3}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <TextField
                label="Description"
                variant="standard"
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                className="w-full"
                multiline
                rows={2}
                tabIndex={2}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold">Genre</h3>

          <div className="flex flex-wrap justify-center">
            {genres.map(({ value, emoji }) => (
              <div key={value} className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                <input id={value} type="radio" value={value} name="genre" onChange={handleChange} />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-2">
          <h3 className="text-xl font-semibold">Tones</h3>

          <div className="flex flex-wrap justify-center">
            {tones.map(({ value, emoji }) => (
              <div key={value} className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                <input id={value} type="radio" name="tone" value={value} onChange={handleChange} />
                <label className="ml-2" htmlFor={value}>
                  {`${emoji} ${value}`}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-2">
          <h3 className="text-xl font-semibold">Temperature</h3>

          <div className="flex items-center justify-center space-x-4">
            <span role="img" aria-label="Deterministic">
              🧊
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.temperature}
              onChange={handleChange}
              name="temperature"
              className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span role="img" aria-label="Random">
              🎲
            </span>
          </div>
          <p className="text-center mt-2">
            Temperature: {state.temperature || constants.openAI.temperature} (
            {Number(state.temperature) < 0.5 ? "More deterministic" : "More random"})
          </p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded disabled:opacity-50"
          disabled={isLoading || !state.genre || !state.tone}
          onClick={() =>
            append({
              role: "user",
              content: `Generate a ${state.genre} story in a ${state.tone} tone`,
            })
          }
        >
          Generate Story
        </button>
        <div
          hidden={messages.length === 0 || messages[messages.length - 1]?.content.startsWith("Generate")}
          className="bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-5"
        >
          <div className="mb-4">{messages[messages.length - 1]?.content}</div>
          {!isLoading && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleEvaluateClick}
            >
              Evaluate Character Roles
            </button>
          )}
        </div>
        <div hidden={!state.isEvaluated} className="bg-opacity-25 bg-gray-700 rounded-lg p-4 mt-5">
          <h3 className="text-xl font-semibold">Character Role Evaluation</h3>
          <p>{state.evaluation}</p>
        </div>
      </div>
    </div>
  );
}
