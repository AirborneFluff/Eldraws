import {usePage} from "../../core/ui/AppLayout.tsx";
import {useEffect} from "react";

export function CreateEventPage() {
  const {setHeaderContent} = usePage();

  useEffect(() => {
    setHeaderContent({
      title: "Create Event",
      subtitle: undefined
    })
  }, []);

  return (
    <>Create Event Page</>
  )
}