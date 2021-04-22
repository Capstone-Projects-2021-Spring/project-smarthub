import React from "react";
import { BaseToast } from "react-native-toast-message";

export default function getToastConfig(){
    return {
        success: ({ text1, text2, ...rest } : any) => (
        <BaseToast
            {...rest}
            style={{ borderLeftColor: '#E0A458', backgroundColor: "#fff", marginTop: 25}}
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
            style={{ borderLeftColor: '#E0A458', backgroundColor: "#fff", marginTop: 25}}
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