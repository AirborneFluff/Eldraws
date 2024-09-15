import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {usePage} from "../../core/ui/AppLayout.tsx";
import {useEffect} from "react";

export function HomePage() {
  const navigate = useNavigate();
  const {setHeaderContent} = usePage();

  useEffect(() => {
    setHeaderContent({
      title: 'Eldraws',
      subtitle: 'Demo'
    });
  }, []);

  return (
    <div>
      <Button onClick={() => navigate("guilds")}>Goto Guilds</Button>
    </div>
  )
}