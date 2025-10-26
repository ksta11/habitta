import { View } from 'react-native';
import FormEditUserProfile from '../../modules/user/profile/FormEditUserProfile';

export default function ScreenEditUserProfile() {
  return (
    <View className="flex-1 w-full" style={{ backgroundColor: '#7C3AED' }}>
      {/* <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full"
        style={{ backgroundColor: '#7C3AED', width: '100%' }}
      > */}
        <FormEditUserProfile />
      {/* </KeyboardAvoidingView> */}
    </View>
  );
}
