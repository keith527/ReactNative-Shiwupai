
import React, {Component} from 'react';
import {Animated, StyleSheet, View, Text, AppRegistry} from 'react-native'
import {Provider} from 'mobx-react/native';
import store from './store/index';
import NetInfoDecorator from './component/NetInfoDecorator';
import AppNavigation2 from './AppNavigation2';
import AppNavigation from './AppNavigation';

if(!__DEV__){
    global.console = {
        log: () => {}
    }
}


@NetInfoDecorator
export class Root extends Component{

    constructor(props){
        super(props);
        this.state = {
            promptPosition: new Animated.Value(0)//位置动画的初始值
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isConnected} = nextProps;
        if(!isConnected){//网络连接失败
            Animated.timing(//随时间变化
                this.state.promptPosition,
                {toValue:1, duration:200},
            ).start(() => {
                setTimeout(() => {
                    Animated.timing(
                        this.state.promptPosition,{
                            toValue:0,
                            duration:200,
                        }
                    ).start();
                },2000);
            })
        }
    }

    render(){

        let positionY = this.state.promptPosition.interpolate({
            inputRange:[0,1],
            outputRange: [-30, __IOS__? 20:0]
        });
        return(
            <View style={{flex:1}}>
                <Provider {...store}>
                    <AppNavigation2/>
                </Provider>
                <Animated.View style={[styles.netInfoView, {top:positionY}]}>
                    <Text style={styles.netInfoPrompt}>
                        网络异常，请检查网络稍后重试~
                    </Text>
                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    netInfoView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: gColors.theme
    },
    netInfoPrompt: {
        color: 'white',
        fontWeight: 'bold'
    }
})

AppRegistry.registerComponent('ShiwuPai', () => Root)
