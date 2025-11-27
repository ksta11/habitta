import LottieView from "lottie-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HabittaSplashScreen from '../../assets/lotties/HabittaSplashScreen.json';

export default function SplashScreen({ onAnimationFinish }: { onAnimationFinish?: () => void }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="justify-center items-center">
        <LottieView 
          source={HabittaSplashScreen} 
          autoPlay 
          resizeMode="cover"
          loop={false}
          onAnimationFinish={onAnimationFinish}
          style={{ flex: 1, width: '100%'}}
        />
    </View>
  );
}