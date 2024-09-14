"use client";
import React from "react";
import { ChangeEvent, useId, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TextField, Button, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useChat } from "ai/react";
import { getApiUrl } from "@lib/api.ts";
import { constants } from "@lib/index";
import { characters as defaultCharacters, genres, tones } from "@lib/storyTeller";
import { Character } from "types/Character";
import { RangeInput } from "@components/ux";

type ChatBody = {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  topP: number;
  ragTemperature: number;
  characters: Character[];
  genre: string;
  tone: string;
  temperature: number;
  evaluation?: string | undefined;
  isEvaluated: boolean;
  maxTokens: number;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Chat() {
  const answerId = useId();
  const sourceId = useId();
  const [text, setText] = useState("");
  const [needsNewIndex, setNeedsNewIndex] = useState(true);
  const [buildingIndex, setBuildingIndex] = useState(false);
  const [runningQuery, setRunningQuery] = useState(false);
  const [nodesWithEmbedding, setNodesWithEmbedding] = useState([]);
  const [answer, setAnswer] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const [characters, setCharacters] = useState(defaultCharacters);
  const [newCharacter, setNewCharacter] = useState({ name: "", description: "", personality: "" });
  const [state, setState] = useState({
    chunkSize: constants.openAI.rag.chunkSize,
    chunkOverlap: constants.openAI.rag.chunkOverlap,
    topK: constants.openAI.rag.topK,
    topP: constants.openAI.rag.topP,
    ragTemperature: "" + constants.openAI.rag.temperature,
    genre: "",
    tone: "",
    temperature: "" + constants.openAI.temperature,
    evaluation: "",
    isEvaluated: false,
    maxTokens: constants.openAI.maxTokens,
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Set the worker source. This tells PDF.js where to find the worker script, which is necessary for processing PDFs.
    // We're using a CDN to load the worker script. The version is dynamically set based on the version of PDF.js you're using.
    // const loadPdfWorker = async () => {
    //   try {
    //     pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;
    //     // await pdfjsLib.getDocument({ data: new Uint8Array() }).promise;
    //     console.log("PDF.js worker initialized successfully");
    //   } catch (error) {
    //     console.error("Error initializing PDF.js worker:", error);
    //   }
    // };
    // loadPdfWorker();
    // usePDFJS(async (pdfjs: typeof PDFJS) => {
    //   console.log(pdfjs)
    // })
  }, []);

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
      maxTokens: state.maxTokens,
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

  const evaluateContent = async (content: string) => {
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
      evaluation: evaluation.text,
      isEvaluated: true,
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

  const handleFileUpload = async (file: File) => {
    console.log("index -> handleFileUpload -> file", file);
    setIsLoading2(true);
    try {
      if (file.type === "application/pdf") {
        console.log("index -> handleFileUpload -> pdf document detected");
        setAnswer("Error processing file - PDF documents aren't supported.");
        // const arrayBuffer = await file.arrayBuffer();
        // // console.log("index -> handleFileUpload -> arrayBuffer created");

        // const loadingTask = pdfjsLib.getDocument({
        //   data: arrayBuffer,
        //   password: "",
        //   nativeImageDecoderSupport: "none",
        //   disableFontFace: true,
        //   pdfBug: true,
        // });
        // // console.log("index -> handleFileUpload -> loadingTask created");

        // loadingTask.onProgress = (progressData: unknown) => {
        //   console.log(
        //     // @ts-expect-error ignore
        //     `index -> handleFileUpload -> loadingTask -> loading PDF: ${((progressData.loaded / progressData.total) * 100).toFixed(2)}%`,
        //   );
        // };

        // try {
        //   const pdf = await Promise.race([
        //     loadingTask.promise,
        //     new Promise((_, reject) => setTimeout(() => reject(new Error("PDF loading timed out")), 10000)), // Timeout after 10 seconds
        //   ]);
        //   // console.log("index -> handleFileUpload -> pdf document fetched");

        //   let fullText = "";

        //   for (let i = 1; i <= pdf.numPages; i++) {
        //     const page = await pdf.getPage(i);
        //     const textContent = await page.getTextContent();
        //     const pageText = textContent.items.map((item: unknown) => (item as { str: string }).str).join(" ");
        //     fullText += pageText + "\n";
        //     console.log(`index -> handleFileUpload -> pdf -> fullText fetched for page ${i} / ${pdf.numPages}...`);
        //   }
        //   setText(fullText);
        // } catch (pdfError) {
        //   console.error("Error loading PDF:", pdfError);
        //   if (pdfError instanceof Error && pdfError.name === "PasswordException") {
        //     setAnswer("Error: This PDF is password-protected. Please provide an unprotected PDF.");
        //   } else {
        //     setAnswer(`Error loading PDF: ${pdfError instanceof Error ? pdfError.message : "Unknown error"}`);
        //   }
        //   return;
        // }
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          console.log("index -> handleFileUpload -> non-pdf document text fetched");
          setText(content);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      setAnswer(`Error processing file: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading2(false);
      setNeedsNewIndex(true);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 max-w-3xl mx-auto">
        <div className="mx-auto space-y-4 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Multi-Character Story Telling App
          </h1>
          <p className="text-lg text-zinc-400 dark:text-purple-300 max-w-2xl mx-auto">
            Craft unique tales by adding characters, choosing a genre, and setting the perfect tone.
          </p>
        </div>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
          <Tab label="Upload" icon={<CloudUploadIcon />} />
          <Tab label="Index" icon={<InsertDriveFileIcon />} />
          <Tab label="Extract" icon={<Loader2 />} />
          <Tab label="Characters" icon={<PersonIcon />} />
          <Tab label="Generate" icon={<CreateIcon />} />
        </Tabs>

        {tabValue === 0 && (
          <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-white mb-4">Upload Character Definitions File</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="w-full items-center sm:w-auto relative">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  disabled={isLoading2}
                  className="w-full sm:w-auto bg-purple-800 text-white hover:bg-purple-600"
                >
                  {isLoading2 ? "Loading..." : "Upload Story / Character Definitions File"}
                  <VisuallyHiddenInput
                    id="file-upload"
                    type="file"
                    accept=".txt,.md"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      console.log("File input changed");
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("File selected:", file.name, file.type);
                        handleFileUpload(file);
                      } else {
                        console.log("No file selected");
                      }
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-auto py-2 text-white disabled:bg-purple-900 disabled:text-white disabled:opacity-50"
                    disabled={isLoading2}
                    // multiple
                  />
                </Button>
                {isLoading2 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
              <Button
                variant="contained"
                onClick={() => {
                  setText("");
                  setNeedsNewIndex(true);
                }}
                className="w-full sm:w-auto bg-indigo-900 text-white hover:bg-indigo-800 disabled:bg-purple-900 disabled:text-white disabled:opacity-50"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        )}

        {tabValue === 1 && (
          <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-white mb-4">Build Index</h3>
            <RangeInput
              headingCls={"text-xl"}
              heading="Chunk Size"
              tooltip={
                "The maximum size of the chunks we are searching over, in tokens. " +
                "The bigger the chunk, the more likely that the information you are looking " +
                "for is in the chunk, but also the more likely that the chunk will contain " +
                "irrelevant information."
              }
              min={1}
              max={3000}
              step={1}
              value={state.chunkSize}
              onChange={handleChange}
              name="chunkSize"
              paragraphText={`Chunk Size: ${state.chunkSize || constants.openAI.rag.chunkSize}<br /><span class="text-sm text-purple-200">(${Number(state.chunkSize) < 1024 ? "Less hit probability, more relevant" : "Higher hit probability, less relevant"})</span>`}
              emojiStart="🧊"
              emojiEnd="🎲"
              disabled={text?.length <= 0}
            />
            <RangeInput
              headingCls={"text-xl"}
              heading="Chunk Overlap"
              tooltip={
                "The maximum amount of overlap between chunks, in tokens. " +
                "Overlap helps ensure that sufficient contextual information is retained."
              }
              min={1}
              max={600}
              step={1}
              value={state.chunkOverlap}
              onChange={handleChange}
              name="chunkOverlap"
              paragraphText={`Chunk Overlap: ${state.chunkOverlap || constants.openAI.rag.chunkOverlap}<br /><span class="text-sm text-purple-200">(${Number(state.chunkOverlap) < 1024 ? "Less contextual information retained" : "More contextual information retained"})</span>`}
              emojiStart="🧊"
              emojiEnd="🎲"
              disabled={text?.length <= 0}
            />
            <div className="my-2 flex h-3/4 flex-auto flex-col space-y-2">
              <TextField
                id={sourceId}
                label="Extracted Text"
                variant="standard"
                value={text}
                className="flex-1"
                multiline
                rows={2}
                slotProps={{
                  input: { style: { color: "white" } },
                  inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                }}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setText(e.target.value);
                  setNeedsNewIndex(true);
                }}
              />
            </div>
            <Button
              variant="contained"
              disabled={!needsNewIndex || buildingIndex || runningQuery}
              onClick={async () => {
                setAnswer("Building index...");
                setBuildingIndex(true);
                setNeedsNewIndex(false);
                const result = await fetch(getApiUrl(constants.routes.api.splitEmbed), {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    document: text,
                    chunkSize: state.chunkSize,
                    chunkOverlap: state.chunkOverlap,
                  }),
                });
                const { error, payload } = await result.json();

                if (error) {
                  setAnswer(error);
                }

                if (payload) {
                  setNodesWithEmbedding(payload.nodesWithEmbedding);
                  setAnswer("Index built!");
                }

                setBuildingIndex(false);
              }}
              className="w-full sm:w-auto bg-purple-800 text-white hover:bg-purple-600 disabled:bg-purple-900 disabled:text-white disabled:opacity-50"
            >
              {buildingIndex ? "Building Vector index..." : "Build index"}
            </Button>
          </div>
        )}

        {tabValue === 2 && (
          <>
            <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-white mb-4">Extract Characters</h3>
              {buildingIndex || needsNewIndex ? (
                <div className="text-center text-white">
                  {buildingIndex
                    ? "Please wait while the index is being built or the text is being updated."
                    : "Please upload a file and extract the character data first."}
                </div>
              ) : (
                <>
                  <div className="my-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <RangeInput
                      headingCls={"text-xl"}
                      heading="Top K"
                      tooltip={
                        "The maximum number of chunks to return from the search. " +
                        "It's called Top K because we are retrieving the K nearest neighbors of the query."
                      }
                      min={1}
                      max={15}
                      step={1}
                      value={state.topK}
                      onChange={handleChange}
                      name="topK"
                      paragraphText={`Top K: ${state.topK || constants.openAI.rag.topK}<br /><span class="text-sm text-purple-200">(${Number(state.topK) < 7 ? "Less...?" : "More...?"})</span>`}
                      emojiStart="🧊"
                      emojiEnd="🎲"
                      disabled={text?.length <= 0}
                    />
                    <RangeInput
                      headingCls={"text-xl"}
                      heading="Top P"
                      tooltip={
                        "Top P is another way to control the variability of the model " +
                        "response. It filters out low probability options for the model. It's " +
                        "recommended by OpenAI to set temperature to 1 if you're adjusting " +
                        "the top P."
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      value={state.topP}
                      onChange={handleChange}
                      name="topP"
                      paragraphText={`Top P: ${state.topP || constants.openAI.rag.topP}<br /><span class="text-sm text-purple-200">(${Number(state.topP) < 0.5 ? "Less...?" : "More...?"})</span>`}
                      emojiStart="🧊"
                      emojiEnd="🎲"
                      disabled={text?.length <= 0}
                    />
                    <RangeInput
                      headingCls={"text-xl"}
                      heading="Temperature"
                      tooltip={
                        "Temperature controls the variability of model response. Adjust it " +
                        "downwards to get more consistent responses, and upwards to get more diversity."
                      }
                      min={0}
                      max={0.1}
                      step={1}
                      value={state.ragTemperature}
                      onChange={handleChange}
                      name="ragTemperature"
                      paragraphText={`Temperature: ${state.ragTemperature || constants.openAI.rag.temperature}<br /><span class="text-sm text-purple-200">(${Number(state.ragTemperature) < 0.5 ? "More deterministic" : "More random"})</span>`}
                      emojiStart="🧊"
                      emojiEnd="🎲"
                      disabled={text?.length <= 0}
                    />
                  </div>

                  <div className="my-4">
                    <div className="flex w-full items-center space-x-4">
                      <Button
                        type="submit"
                        disabled={needsNewIndex || buildingIndex || runningQuery}
                        onClick={async () => {
                          setIsLoading2(true);
                          setAnswer("Running query...");
                          setRunningQuery(true);
                          // Post the query and nodesWithEmbedding to the server
                          const result = await fetch(getApiUrl(constants.routes.api.retrieveQuery), {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              nodesWithEmbedding,
                              topK: state.topK,
                              temperature: state.ragTemperature,
                              topP: state.topP,
                            }),
                          });

                          const { error, characters } = await result.json();

                          if (error) {
                            setAnswer(error);
                          }

                          if (characters) {
                            // {
                            //   characters: [
                            //     {
                            //       name: 'GINGERBREAD MAN',
                            //       personality: 'Feisty, defiant',
                            //       description: 'A small, animated gingerbread man who is not afraid to speak his mind, even under threat.'
                            //     },
                            //     ...
                            //   ]
                            // }
                            setCharacters(characters);
                            const characterNames = characters
                              .map((c: Character) => `${c.name}: ${c.personality}`)
                              .join(", ");
                            setAnswer(`Found ${characters.length} characters: ${characterNames}`);
                          }

                          setRunningQuery(false);
                          setIsLoading2(false);
                        }}
                        className="w-full sm:w-auto bg-purple-800 text-white hover:bg-purple-600 disabled:bg-purple-900 disabled:text-white disabled:opacity-50"
                      >
                        Extract Characters
                      </Button>
                    </div>
                    {isLoading2 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="my-2 flex h-1/4 flex-auto flex-col space-y-2">
                    <TextField
                      id={answerId}
                      label="Answer"
                      variant="standard"
                      className="flex-1"
                      slotProps={{
                        input: { style: { color: "white" } },
                        inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                      }}
                      aria-readonly={true}
                      value={answer}
                      multiline={true}
                      rows={5}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {tabValue === 3 && (
          <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-white mb-4">Characters</h3>

            <div className="space-y-4">
              {characters.map((character, index) => (
                <div key={index} className="rounded-lg p-4 space-y-2 bg-white bg-opacity-10 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex-grow flex space-x-2">
                      <TextField
                        label="Name"
                        variant="standard"
                        value={character.name}
                        onChange={(e) => editCharacter(index, "name", e.target.value)}
                        className="flex-1"
                        slotProps={{
                          input: { style: { color: "white" } },
                          inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                        }}
                      />
                      <TextField
                        label="Personality"
                        variant="standard"
                        value={character.personality || ""}
                        onChange={(e) => editCharacter(index, "personality", e.target.value)}
                        className="flex-1"
                        slotProps={{
                          input: { style: { color: "white" } },
                          inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                        }}
                      />
                    </div>
                    <button
                      onClick={() => deleteCharacter(index)}
                      className="text-purple-200 hover:text-red-500 transition-colors duration-300"
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
                    slotProps={{
                      input: { style: { color: "white" } },
                      inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-lg p-4 space-y-2 bg-white bg-opacity-10 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div className="flex-grow flex space-x-2">
                    <TextField
                      label="Name"
                      variant="standard"
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      className="flex-1"
                      slotProps={{
                        input: { style: { color: "white" } },
                        inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                      }}
                    />
                    <TextField
                      label="Personality"
                      variant="standard"
                      value={newCharacter.personality}
                      onChange={(e) => setNewCharacter({ ...newCharacter, personality: e.target.value })}
                      className="flex-1"
                      slotProps={{
                        input: { style: { color: "white" } },
                        inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                      }}
                    />
                  </div>
                  <button
                    onClick={addCharacter}
                    className="text-purple-200 hover:text-green-500 transition-colors duration-300"
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
                  slotProps={{
                    input: { style: { color: "white" } },
                    inputLabel: { style: { color: "rgba(255, 255, 255, 0.7)" } },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {tabValue === 4 && (
          <>
            <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-white mb-4">Select Your Genre</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {genres.map(({ value, emoji }) => (
                  <div key={value} className="relative">
                    <input
                      id={value}
                      type="radio"
                      value={value}
                      name="genre"
                      onChange={handleChange}
                      className="peer absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    <label
                      htmlFor={value}
                      className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer
                             hover:bg-opacity-20 hover:border-purple-300
                             peer-checked:bg-opacity-30 peer-checked:border-purple-500 peer-checked:text-purple-200"
                    >
                      <span className="text-3xl mb-2">{emoji}</span>
                      <span className="font-medium text-white">{value}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 mt-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-white mb-4">Select Your Tone</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tones.map(({ value, emoji }) => (
                  <div key={value} className="relative">
                    <input
                      id={value}
                      type="radio"
                      value={value}
                      name="tone"
                      onChange={handleChange}
                      className="peer absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    <label
                      htmlFor={value}
                      className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer
                             hover:bg-opacity-20 hover:border-purple-300
                             peer-checked:bg-opacity-30 peer-checked:border-purple-500 peer-checked:text-purple-200"
                    >
                      <span className="text-3xl mb-2">{emoji}</span>
                      <span className="font-medium text-white">{value}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <RangeInput
              containerCls={"shadow-lg"}
              headingCls={"text-2xl"}
              heading="Set Temperature"
              min={0}
              max={1}
              step={0.1}
              value={state.temperature}
              onChange={handleChange}
              name="temperature"
              paragraphText={`Temperature: ${state.temperature || constants.openAI.temperature}<br /><span class="text-sm text-purple-200">(${Number(state.temperature) < 0.5 ? "More deterministic" : "More random"})</span>`}
              emojiStart="🧊"
              emojiEnd="🎲"
            />
            <RangeInput
              containerCls={"shadow-lg"}
              headingCls={"text-2xl"}
              heading="Set Maximum Tokens"
              min={500}
              max={2000}
              step={100}
              value={state.maxTokens}
              onChange={(e) => setState({ ...state, maxTokens: parseInt(e.target.value) })}
              name="maxTokens"
              paragraphText={`Maximum Tokens: ${state.maxTokens}<br /><span class="text-sm text-purple-200">(${state.maxTokens < 1000 ? "Shorter response" : "Longer response"})</span>`}
              emojiStart="📄"
              emojiEnd="📚"
            />

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
          </>
        )}
      </div>
    </div>
  );
}
