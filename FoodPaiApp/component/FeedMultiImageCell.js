
import React, {Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity,Image} from 'react-native';


export default FeedMultiImageCell = ({
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
            <Text>{title}</Text>
            <View style={styles.imagesWrap}>
                {images.map((image,index) => {
                    return(
                        <Image
                            key={`${image}-${index}`}
                            style={styles.image}
                            source={{uri:image}}
                            defaultSource={require('../resource/img_news_default.png')}/>
                    )
                })}
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.viewCount}>{source}</Text>
                <View style={{flexDirection:'row', marginLeft:20,}}>
                    <Image style={styles.feedIcon} source={require('../resource/ic_feed_watch.png')}/>
                    <Text style={styles.viewCount}>{viewCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        width:gScreen.width,
        marginTop:15,
        backgroundColor:'#fff',
        padding:15,
        justifyContent:'space-between',

    },
    imagesWrap:{
       flexDirection:'row',
       justifyContent:'space-between',
        marginVertical:10,
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