import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import prompt from 'react-native-prompt-android';
import Toast from 'react-native-toast-message'
import {getAddressString} from '../../utils/utilities';

export default async function ImagePickerPage(props: any, routeObject: any, parentFlatList: any){
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true
    });
    
    let email = "";

    const getUserInfo = async () => {
        let collection: any = {}
        collection.user_id = routeObject.params.item.user_id;
        //console.log(collection)
        await axios.post(getAddressString() + '/profiles/getUserInfo', collection).then((response) => {
            console.log(response.data.profiles[0].user_email)
            email = response.data.profiles[0].user_email;
        }, (error) => {
            console.log(error);
        })
    }

    if(!result.cancelled){
        prompt(
        'Enter an image name:',
        '',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: async (imageName: string) => { 
                console.log('OK Pressed, imageName: ' + imageName); 
                if(!result.cancelled){
                    var options = {encoding: FileSystem.EncodingType.Base64}
                    let datauri = "data:image/png;base64," 
                    datauri += await FileSystem.readAsStringAsync(result.uri, options)
                    await getUserInfo();
                    var collection = {
                        data_uri: datauri,
                        image_name: imageName,
                        user_email: email,
                        component_name: "Faces",
                        profile_name: routeObject.params.item.profile_name, 
                        profile_id: routeObject.params.item.profile_id
                    }
                    // Toast.show({
                    //     type: 'error',
                    //     text1: "Processing Please Wait...",
                    //     visibilityTime: 5000
                    // });
                    alert("Processing Please Wait...");
                    axios.post("http://petepicam1234.zapto.org:4000/faces/addFaceImage", collection).then((response) => {
                        // Toast.show({
                        //     type: 'success',
                        //     text1: response.data,
                        //     visibilityTime: 2000
                        // })
                        alert(response.data);
                        console.log(response.data)
                        parentFlatList.getDataList();
                        props.refs.facialRecognitionModal.close();
                    }, ({error, response}) : any => {
                        console.log(error)
                        // Toast.show({
                        //     type: 'error',
                        //     text1: response.data,
                        //     text2: 'Please Try again...',
                        //     visibilityTime: 2000
                        // });
                        alert(response.data);
                    })
                }
            }},
        ],
        {
            cancelable: false,
        }
    );}
}