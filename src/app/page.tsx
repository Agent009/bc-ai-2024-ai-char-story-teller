"use client";
import { useState } from "react";
import { useChat } from "ai/react";
import { getApiUrl } from "@lib/api.ts";
import { constants } from "@lib/constants.ts";
import { genres, tones } from "@lib/storyTeller";

export default function Chat() {
  const { messages, append, isLoading } = useChat({
    api: getApiUrl(constants.routes.api.chat),
    keepLastMessageOnError: true,
    onError(error) {
      console.log("error", error);
    },
  });
  // console.log("page -> input", input, "messages", messages);

  const [state, setState] = useState({
    genre: "",
    tone: "",
  });

  const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 max-w-3xl mx-auto">
        <div className="mx-auto space-y-2">
          <h2 className="text-3xl font-bold">Story Telling App</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Customize the story by selecting the genre and tone.</p>
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
          {messages[messages.length - 1]?.content}
        </div>
      </div>
    </div>
  );
}
