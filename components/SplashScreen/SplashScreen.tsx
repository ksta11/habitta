import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native";
import habitta from '../../assets/lotties/Habitta.json';

export default function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
        <LottieView 
          source={habitta} 
          autoPlay 
          resizeMode="cover"
          loop={false}
          style={{ flex: 1, width: '100%'}}
        />
    </SafeAreaView>
  );
}