
import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FeedHomeList from './FeedHomeList';
import FeedEvaluatingList from './FeedEvaluatingList';
import FeedDelicacyList from './FeedDelicacyList';
import FeedKnowledgeList from './FeedKonwledgeList';
import FeedsCategoryBar from '../../component/FeedsCategoryBar';

const TITLES = ['首页', '评测', '知识', '美食'];
const CONTROLLERS = [
    {categoryId:1, controller: FeedHomeList},
    {categoryId:2, controller: FeedEvaluatingList},
    {categoryId:3, controller: FeedKnowledgeList},
    {categoryId:4, controller: FeedDelicacyList}
];

const HeaderView = ({pictureAction}) => {
    return (
        <View style={[styles.header, {borderBottomWidth: gScreen.onePix}]} >
            <Image
                style={{width: 60, height: 30}}
                source={require('../../resource/ic_feed_nav.png')}
                resizeMode="contain"
            />
            <TouchableOpacity
                activeOpacity={0.75}
                style={styles.photo}
                onPress={pictureAction}
            >
                <Image
                    style={{width: 20, height: 20}}
                    source={require('../../resource/ic_feed_camera.png')}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
}


export default class Feed extends Component{

    _pictureAction = () => {
        alert('Picture');
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <HeaderView pictureAction={this._pictureAction}/>
                <ScrollableTabView
                    style={{backgroundColor:'#fff'}}
                    renderTabBar={() => <FeedsCategoryBar tabNames={TITLES}/> }
                    tabBarPosition='top'
                    scrollWithoutAnimation={false}>
                    {CONTROLLERS.map((data, index) => {
                        let Component = data.controller;
                        return(
                            <Component
                                key={TITLES[index]}
                                tabLabel={TITLES[index]}
                                categoryId={data.categoryId}
                                />
                        );
                    })}
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    header:{
        height:gScreen.navBarHeight,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingTop:gScreen.navBarPaddingTop,
        paddingLeft:gScreen.width/2-30,
        borderBottomColor: '#d9d9d9',

    },
    photo:{
        width: __IOS__ ? 44 : 50,
        height: __IOS__ ? 44 : 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: gScreen.navBarPaddingTop
    }
})