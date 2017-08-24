
import React, {Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import {observer, inject} from 'mobx-react/native';
import Router from './constant/Routers';

@inject('app')
@observer
export default class AppNavigation extends Component{


    configureScene = route => {
        if (route.sceneConfig) return route.sceneConfig

        return {
            ...Navigator.SceneConfigs.PushFromRight,
            gestures: {}    // 禁用左滑返回手势
        }
    }

    renderScene = (route, navigator) => {
        let Component = Router[route.id].default
        return <Component navigator={navigator} {...route.passProps}/>
    }
    render(){

        const initialPage = 'Feed';
        return(
            <View style={{flex:1}}>
                <StatusBar barStyle={this.props.app.barStyle} animated/>
                <Navigator
                    initialRoute={{id: initialPage}}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}/>
            </View>
        );
    }
}