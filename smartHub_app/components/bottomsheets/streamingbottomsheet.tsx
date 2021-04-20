import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import React, { useState } from 'react';
import { ActionSheet } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

const BottomSheet = (props) => {

    const [alignment] = useState(new Animated.Value(0));

    const bringUpBottomSheet = () => {
        Animated.timing(alignment, {
            useNativeDriver: false,
            toValue: 1,
            duration: 500
        }).start();
    };

    const bottomSheetInterpolate = alignment.interpolate({
        inputRange: [0, 1],
        outputRange: [-Dimensions.get("screen").height/3 + 300, 0]
    });

    const bottomSheetStyle = {
        bottom: bottomSheetInterpolate
    };

    const gestureHandler = (e: any) => {
        console.log("swiping up");
        if(e.nativeEvent.contentOffset.y > 0)
        {
            // console.log("swiping up");
            bringUpBottomSheet();
        }
    };

    return (
        <Animated.View style={[styles.container, bottomSheetStyle]}>
            <View>
                <ScrollView style={styles.touchArrow} onScroll={(e) => {console.log("made into scrollview"); gestureHandler(e);}}>
                </ScrollView>                
            </View>
            <Text style={{paddingLeft: 80}}> This is a Swipeable Bottom Sheet</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height:  Dimensions.get("screen").height / 3,
        width:  Dimensions.get("screen").width / 1,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40
    },

    touchArrow: {
        width: 60,
        borderTopWidth: 5,
        borderTopColor: '#aaa'
    }
});

export default BottomSheet;