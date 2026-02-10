import { StyleSheet, Text, View,FlatList,ActivityIndicator } from 'react-native'
import React,{useState,useEffect} from 'react'
import {Layout} from '../../components/ui/Layout';
import { Typography } from '../../components/ui/Typography';
import IncidentCard from './IncidentCard';
import {getIncidentsApi} from '../../api/incidentApi';
import { theme } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

const IncidentListScreen = () => {
    const navigation=useNavigation();
    const [incidents,setIncidents]=useState<any[]>([]);
    const [loading,setLoading]=useState(true);
    const fetchIncidents=async()=>{
        try{
            const response=await getIncidentsApi();
            setIncidents(response.data);
        }
        catch(error){
            console.log('Failed to fech incidents',error);
        }
        finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchIncidents();
    },[]);

    if(loading){
        return(
            <Layout>
                <ActivityIndicator size='large'/>
            </Layout>
        );
    }

  return (
    <Layout>
      <Typography variant='h2' style={{marginBottom:theme.spacing.md}}>All Incidents</Typography>
      <FlatList data={incidents} keyExtractor={(item)=>item.id.toString()} renderItem={({item})=>(
        <IncidentCard title={item.title} priority={item.priority} status={item.status} reporter={item.reporter?.name||'Unknown'} onPress={()=>{
            navigation.navigate('IncidentDetails',{incident:item})
        }}/>
      )}/>
    </Layout>
  );
}

export default IncidentListScreen

const styles = StyleSheet.create({})