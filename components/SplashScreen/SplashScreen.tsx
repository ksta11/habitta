import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import habitta from '../../assets/lotties/Habitta.json';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="justify-center items-center">
        <LottieView 
          source={habitta} 
          autoPlay 
          resizeMode="cover"
          loop={false}
          style={{ flex: 1, width: '100%'}}
        />
    </View>
  );
}