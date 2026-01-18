import { StyleSheet, Text, View,TextInput,Button } from 'react-native'
import React,{useState} from 'react'
import { useDispatch, UseDispatch } from 'react-redux'
import { loginApi } from '../../api/authApi'
import { loginSuccess } from '../../redux/authSlice'

const LoginScreen = () => {
  const dispatch=useDispatch();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const handleLogin=async()=>{
    try{
      const response=await loginApi(email,password);
      dispatch(loginSuccess({
        user:response.data.user,
        token:response.data.token,
      }));
    }
    catch(err:any)
    {
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput placeholder='Enter email' value={email} onChangeText={setEmail}/>
      <TextInput placeholder='Enter password' value={password} onChangeText={setPassword}/>
      {error?<Text style={styles.error}>{error}</Text>:null}
      <Button title='Login' onPress={handleLogin}></Button>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    padding:20,
  },
  error:{
    color:'red',
  },
})