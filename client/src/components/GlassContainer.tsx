export function GlassContainer({children}) {
  return (
    <div className='h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100'>
      {children}
    </div>
  )
}