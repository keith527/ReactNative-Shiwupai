
import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,Image} from 'react-native';

export default FeedSingleImageItem = ({
    title,
    source,
    viewCount,
    images,
    onPress
}) => {
        return(
            <TouchableOpacity
                onPress={onPress}
                style={styles.container}
                activeOpacity={0.9}>
                    <View style={{justifyContent:'space-between'}}>
                        <Text numberOfLines={2} style={styles.title}>{title}</Text>
                        <View style={styles.content}>
                            <Text style={styles.viewCount}>{source}</Text>
                            <View style={styles.imageWrap}>
                                <Image style={styles.feedIcon} source={require('../resource/ic_feed_watch.png')}/>
                                <Text style={styles.viewCount}>{viewCount}</Text>
                            </View>
                        </View>
                    </View>
                    <Image style={styles.image} source={{uri:images[0]}}/>

            </TouchableOpacity>
        );

}

const styles = StyleSheet.create({
    container:{
        width:gScreen.width,
        marginTop:15,
        backgroundColor:'#fff',
        padding:15,
        flexDirection:'row',
        justifyContent:'space-between'

    },

    title:{
        fontSize:15,
        width:gScreen.width*0.55,

    },

    content:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },

    imageWrap:{
        flexDirection:'row',
    },

    image:{
        height:80,
        width:(gScreen.width-15*2-10*2)/3
    },
    feedIcon:{
        width:14,
        height:14,
        marginRight:3
    },
    viewCount: {
        color: 'rgb(150,150,150)',
        fontSize: 13
    }
});