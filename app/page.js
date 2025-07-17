'use client';
import { useActionState, useEffect, useState } from "react";
import { submitRequest } from "@/app/api/generate/route";
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextDisabled, setIsTextDisabled] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [state, formAction, pending] = useActionState(submitRequest, { prompt: '' })

  useEffect(() => {
    if (prompt.length == 0) {
      setIsProcessing(true)
    } else {
      setIsProcessing(false)
    }
  }, [ prompt ])

  useEffect(() => {
    if (pending) {
      setIsProcessing(true)
      setIsTextDisabled(true)
    } else {
      setIsProcessing(false)
      setIsTextDisabled(false)
    }
  }, [ pending ])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <form action={formAction} className="font-sans w-full max-w-4xl flex flex-col gap-6 items-center">
        <textarea className={`w-128 h-40 
            max-w-4xl p-4 
            border border-gray-800 bg-slate-800 
            rounded-2xl resize-none 
            text-left align-top whitespace-pre-wrap break-words 
            focus:outline-0 ${isTextDisabled ? 'disabled:opacity-25' : ''}`}
            
            placeholder="Input the text you wish to analyse here..."
            disabled={isTextDisabled}
            onChange={(e) => setPrompt(e.target.value)}
            id="prompt"
            name="prompt"
            required
            value = {prompt}
            >

          </textarea>
          <div
          className={`
            w-full max-w-4xl
            max-h-60
            p-4
            bg-transparent border-0
            rounded-2xl
            overflow-auto
            whitespace-pre-wrap break-words
          `}
          >
            <ReactMarkdown>
              {state?.message}
            </ReactMarkdown>
          </div>
          <button 
            className={
                `px-4 py-2 rounded font-semibold
                ${
                isProcessing 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-300 text-black cursor-pointer'
                }`
            }
            type="submit"
            >
                Analyse
            </button>
      </form>
    </div>
  );
}
