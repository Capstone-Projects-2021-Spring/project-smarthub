import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

export default async function ImagePickerPage (){
   
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false
        })

        if(!result.cancelled){
            //console.log(result.uri);
            var options = {encoding: FileSystem.EncodingType.Base64}
            let datauri = "data:image/png;base64," 
            datauri += await FileSystem.readAsStringAsync(result.uri, options)
            var collection = {
                text: datauri
            }
        }
            
            //Below was used for image picker testing
            // await axios.post("http://192.168.4.23:4000/uri", collection).then((response) => {
            //     console.log(response.status)
            // },(error) => {
            //     console.log(error)
            // })
            // var uri = await datauri(result.uri)
            // console.log(datauri)   
}