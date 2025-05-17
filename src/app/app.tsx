
import { Layout } from '../components/Layout';
import { useChatViewModel } from '../viewmodels/chatViewModel';

function App() {
  const chatViewModel = useChatViewModel();

  return (
    <Layout viewModel={chatViewModel} />
  );
}

export default App;
