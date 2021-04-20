import axios from 'axios';

export function startFaceRec(params: any){
    var collection = {
        user_email: params.user_email,
        profile_name: params.profile_name,
        component_name: "Faces",
        profile_id: params.profile_id,
        device_id: params.device_id,
        phone_number: params.phone_number
    }
    console.log(params)
    var url = 'http://' + params.device_ip + ':4000/video/start_face_reg';
    axios.post(url, collection).then((response) => {
        console.log(response.data);
        console.log("Starting Face Rec")
    }, ({error, response}) => {
        console.log(error);
        console.log(response)
    })
}

export function stopFaceRec(deviceIP: String){
    var url = 'http://' + deviceIP + ':4000/video//stop_face_reg';
    axios.post(url).then((response) => {
        console.log(response.data);
        console.log("Stopping Face Rec")
    }, ({error, response}) => {
        console.log(error);
        console.log(response)
    })
}