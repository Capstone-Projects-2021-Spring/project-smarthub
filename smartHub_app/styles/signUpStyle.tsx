import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: { 
        width: "100%",
        height: height / 2.7,
    },
    centerAlign: {
        justifyContent: "center",
        alignItems: "center",
    },

    inputContainer: {
        backgroundColor: "rgba(255,255,255,1)",
        padding: 20,
        marginTop: -height/1.9,
        borderRadius: 20,
        width: width/1.2,
        height: height/1.4,
        shadowColor: "#000",
        shadowOpacity: 1.35,
        elevation: 8,

    },

    input: {
        textAlign: "center",
        fontSize: 18,
        borderWidth: 1.5,
        borderColor: "#aaa",
        borderRadius: 30,
        width: width/1.37,
        padding: 10,
        marginVertical: 15,
    },
});

export {styles};