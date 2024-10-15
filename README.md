# SVG Sandbox

SVG Sandbox is a React-based application that allows users to create, manipulate, and animate SVG entities in a dynamic environment. It provides a flexible platform for experimenting with various SVG shapes, behaviors, and animations.

## Features

- Create and manipulate SVG entities
- Add custom behaviors and animations to entities
- Real-time rendering and updates
- Entity inspector for detailed view and editing
- AI-powered actions using OpenAI or Groq
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/svg-sandbox.git
   cd svg-sandbox
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Start the development server:
   ```
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Use the PromptBar at the bottom of the screen to input commands
- Select entities by clicking on them
- Inspect and modify entity properties using the EntityInspector
- Use the WorldStateInspector (toggle with ` key) to view the current world state

## AI Integration

SVG Sandbox supports AI-powered actions using either OpenAI or Groq. To use these features:

1. Obtain an API key from OpenAI or Groq
2. When prompted, enter your API key (it will be stored in local storage)
3. Use the `go` function in the console to send prompts to the AI service

Example:
`go("Create a red circle and make it bounce", "groq")`


## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `behaviors/`: Entity behavior definitions
  - `actions/`: Action definitions and AI integration
  - `stores/`: State management using Valtio
  - `utils/`: Utility functions
  - `types/`: TypeScript type definitions
