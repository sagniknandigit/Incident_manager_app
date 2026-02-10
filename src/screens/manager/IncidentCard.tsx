import {View,StyleSheet,TouchableOpacity} from 'react-native';
import {Typography} from '../../components/ui/Typography';
import {theme} from '../../theme/theme';

interface Props{
    title:string;
    priority:string;
    status:string;
    reporter:string;
    onPress:()=>void;
}

export default function IncidentCard({title,priority,status,reporter,onPress}:Props){
    return(
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body" color={theme.colors.textSecondary}>
                Reporter:{reporter}
            </Typography>
            <View style={styles.row}>
                <Typography variant='caption'>Priority:{priority}</Typography>
                <Typography variant='caption'>Status:{status}</Typography>
            </View>
        </TouchableOpacity>
    );
}
const styles=StyleSheet.create({
    card:{
        backgroundColor:theme.colors.surface,
        padding:theme.spacing.md,
        borderRadius:theme.borderRadius.md,
        marginBottom:theme.spacing.sm,
    },
    row:{
        marginTop:theme.spacing.sm,
        flexDirection:'row',
        justifyContent:'space-between',
    },
});