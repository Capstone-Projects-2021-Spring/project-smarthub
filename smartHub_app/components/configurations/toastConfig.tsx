import React from "react";
import { BaseToast } from "react-native-toast-message";

export default function getToastConfig(){
    return {
        success: ({ text1, text2, ...rest } : any) => (
        <BaseToast
            {...rest}
            style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff", marginTop: 35}}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
            fontSize: 18,
            fontWeight: 'bold'
            }}
            text2Style={{
                color: "#000",
                fontSize: 12
            }}
            text1={text1}
            text2={text2}
        />
        ),
    
        error: ({ text1, text2, ...rest } : any) => (
            <BaseToast
            {...rest}
            style={{ borderLeftColor: '#FF9900', backgroundColor: "#fff", marginTop: 35}}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: 'bold'
            }}
            text2Style={{
                color: "#000",
                fontSize: 10
            }}
            text1={text1}
            text2={text2}
            />
        )
    }
}