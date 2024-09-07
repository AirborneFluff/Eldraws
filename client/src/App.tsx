import './App.css'
import { GlassContainer } from './components/GlassContainer.tsx';
import { DiscordButton } from './components/DiscordButton.tsx';
import { Button } from './components/Button.tsx';

function App() {
  console.log(import.meta.env.VITE_DISCORD_OAUTH_URL)
  return (
    <div className='py-72 px-4 min-h-screen'>
      <DiscordButton href={import.meta.env.VITE_DISCORD_OAUTH_URL} />
    </div>
  )
}

export default App

