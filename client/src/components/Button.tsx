export function Button({children, onClick}) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent hover:bg-blurple text-white font-semibold hover:text-white py-2 px-4 border border-burple hover:border-transparent rounded">
      {children}
    </button>
  )
}