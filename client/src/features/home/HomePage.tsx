import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate("guilds")}>Goto Guilds</Button>
    </div>
  )
}