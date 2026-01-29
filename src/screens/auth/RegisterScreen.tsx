import { StyleSheet, Text, View,TextInput,Button } from 'react-native'
import React,{useState} from 'react'

const RegisterScreen = () => {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('USER');
  const [error,setError]=useState('');

  const handleRegister=
  
  return (
    <View style={{padding:20}}>
      <Text>Register</Text>
      <TextInput placeholder='Name' value={name} onChangeText={setName}></TextInput>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail}></TextInput>
      <TextInput placeholder='Password' secureTextEntry value={password} onChangeText={setPassword}></TextInput>
      <TextInput placeholder='Role' value={role} onChangeText={setRole}></TextInput>
      {error?<Text style={{color:'red'}}>{error}</Text>:null}

      <Button title='Register' onPress={handleRegister}></Button>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})