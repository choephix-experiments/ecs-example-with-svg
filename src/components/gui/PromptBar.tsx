import { SparkleIcon } from "lucide-react";
import { useState } from "react";

export function PromptBar() {
  const [prompt, setPrompt] = useState('');
  
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Prompt submitted:', prompt);
    setPrompt('');
  };

  return (
    <form
      onSubmit={handlePromptSubmit}
      className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
    >
      <div className='relative'>
        <input
          type='text'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder='Enter prompt...'
          className='w-96 px-4 py-2 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button type='submit' className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <SparkleIcon className='h-5 w-5 text-gray-500' />
        </button>
      </div>
    </form>
  );
}
