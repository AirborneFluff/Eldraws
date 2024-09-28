export function TilePlaceholder({row, col}) {
  return (
    <div className='w-24 h-24 border border-gray-200 rounded'>
      <span>row: {row}</span>
      <span>col: {col}</span>
    </div>
  )
}