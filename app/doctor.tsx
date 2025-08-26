import {View, Text} from 'react-native'
import { Link } from 'expo-router'

const index = () =>{
    return (
        <View>
            <Text>Doctor's Page</Text>
            <Link href="/doctor/">View Appointments</Link>
        </View>
    )
}




export default index