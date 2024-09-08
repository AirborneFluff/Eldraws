import { DiscordButton } from '../../components/DiscordButton.tsx';

export function LoginPage() {
  return (
    <div className='h-screen flex justify-center items-center w-full'>
      <div className='w-full'>
        <DiscordButton href={import.meta.env.VITE_DISCORD_OAUTH_URL}/>
      </div>
    </div>
  )
}