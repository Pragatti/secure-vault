import { VaultProvider, useVault } from "./context/VaultContext";
import UnlockScreen from "./components/UnlockScreen";
import VaultDashboard from "./components/VaultDashboard";

function VaultApp() {
  const { isLocked } = useVault();
  return isLocked ? <UnlockScreen /> : <VaultDashboard />;
}

export default function App() {
  return (
    <VaultProvider>
      <VaultApp />
    </VaultProvider>
  );
}
